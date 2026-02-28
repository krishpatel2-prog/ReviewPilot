import { useEffect, useMemo, useRef, useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import ReviewForm from './components/ReviewForm';
import LoaderSteps from './components/LoaderSteps';
import ReviewResult from './components/ReviewResult';
import { REVIEW_API_URL } from './config';

const PROCESS_STEPS = 3;

function EmptyState() {
  return (
    <section className="glass-panel mt-6 flex min-h-56 flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <svg className="h-8 w-8 text-cyan-200" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 8h14M7 4h10l3 4v12H4V8l3-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-base font-semibold text-slate-200">Run a review to see AI feedback</p>
    </section>
  );
}

function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <section className="mb-6 rounded-2xl border border-rose-300/30 bg-rose-400/10 p-4 text-sm text-rose-100">
      <p className="font-semibold">Review failed</p>
      <p className="mt-1 text-rose-100/90">{message}</p>
    </section>
  );
}

function parseErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong while processing this pull request. Please try again.';
}

function App() {
  const [repo, setRepo] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const timerRef = useRef(null);

  const canSubmit = useMemo(() => repo.trim() && Number(prNumber) > 0, [repo, prNumber]);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(
    () => () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    },
    [],
  );

  const startStepProgress = () => {
    setActiveStep(0);
    timerRef.current = window.setInterval(() => {
      setActiveStep((current) => (current < PROCESS_STEPS - 1 ? current + 1 : current));
    }, 1200);
  };

  const resetState = () => {
    clearTimer();
    setResult(null);
    setErrorMessage('');
    setIsLoading(false);
    setActiveStep(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage('Please provide a valid repository and pull request number.');
      return;
    }

    clearTimer();
    setErrorMessage('');
    setResult(null);
    setIsLoading(true);
    startStepProgress();

    try {
      const response = await fetch(REVIEW_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo: repo.trim(),
          pr_number: Number(prNumber),
        }),
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}.`;

        try {
          const errorJson = await response.json();
          if (typeof errorJson?.detail === 'string') {
            message = errorJson.detail;
          }
        } catch {
          // Fallback message is already set.
        }

        throw new Error(message);
      }

      const data = await response.json();
      setResult(data);
      setActiveStep(PROCESS_STEPS - 1);
    } catch (error) {
      setErrorMessage(parseErrorMessage(error));
    } finally {
      clearTimer();
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Header />

      <ReviewForm
        repo={repo}
        prNumber={prNumber}
        onRepoChange={setRepo}
        onPrNumberChange={setPrNumber}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <ErrorAlert message={errorMessage} />

      {isLoading ? <LoaderSteps activeStep={activeStep} /> : null}

      {isLoading || result ? (
        <ReviewResult
          result={result}
          isLoading={isLoading}
          repo={repo.trim()}
          prNumber={prNumber}
          onReset={resetState}
        />
      ) : (
        <EmptyState />
      )}
    </Layout>
  );
}

export default App;
