function Header() {
  return (
    <header className="mb-8 sm:mb-10">
      <p className="mb-2 inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-200">
        FLAGSHIP DEMO
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">ReviewPilot</h1>
      <p className="mt-2 text-sm text-slate-300 sm:text-base">AI-powered pull request reviewer</p>
    </header>
  );
}

export default Header;
