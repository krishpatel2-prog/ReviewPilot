# 🤖 ReviewPilot — AI Pull Request Reviewer

ReviewPilot is an AI-powered code review agent that analyzes GitHub pull requests, generates structured feedback, and posts **semantic inline review comments directly on the changed lines of code**.

It transforms LLM reasoning into a real developer workflow.

https://github.com/user-attachments/assets/d34a9f5c-785d-44ca-96b2-9fb1dd4efc5c

Live Demo: https://reviewpilot-frontend.onrender.com
---

## ✨ Features

* 🔍 Ingests real GitHub Pull Requests
* 🧠 LLM-based multi-point code review
* ⚠️ Risk classification based on change scope
* 💬 Inline comments on the exact lines of code
* 📌 Structured PR summary
* 🧭 Multiple issue detection in a single run
* 🎯 Demo-ready UI for running reviews

---

## 🧠 Why ReviewPilot?

Most AI code review demos stop at summarizing diffs.

ReviewPilot acts as a **real reviewer inside GitHub**:

PR → AI analysis → Inline feedback → Developer workflow

This project demonstrates how LLMs can:

* Reason over real code changes
* Make architectural suggestions
* Execute actions in external systems

---

## 🏗️ Architecture

### Flow

1. Fetch PR metadata and diff from GitHub
2. Send diff to LLM for structured analysis
3. Extract multiple review findings
4. Map findings to exact changed lines
5. Post inline review comments via GitHub API
6. Return structured summary to UI

### Tech Stack

**Backend**

* FastAPI
* Groq LLM
* GitHub REST API

**AI Layer**

* Structured prompting
* JSON parsing & validation
* Multi-finding semantic extraction

**Frontend (Demo UI)**

* Static HTML
* Vanilla JavaScript
* TailwindCSS

---

## 📸 Demo Flow

1. Enter repository → `owner/repo`
2. Enter Pull Request number
3. Click **Run AI Review**
4. AI:

   * Analyzes code
   * Posts inline feedback on GitHub
   * Returns structured summary

---

## ⚙️ Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/reviewpilot.git
cd reviewpilot
```

---

### 2️⃣ Backend setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:

```env
GROQ_API_KEY=your_key
GITHUB_TOKEN=your_token
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

---

### 3️⃣ Frontend setup

Run the frontend:

```bash
python frontend-new/serve.py
```

The frontend will be available at `http://127.0.0.1:5500/` and will call the backend at `http://127.0.0.1:8000/review`.

---

## 🔌 API

### POST `/review`

#### Request

```json
{
  "repo": "owner/repo",
  "pr_number": 1
}
```

#### Response

```json
{
  "summary": "...",
  "issues": ["..."],
  "suggestions": ["..."],
  "risk": "low | medium | high"
}
```

---

## 🧪 Example Output

* Inline comments on risky code paths
* Architectural improvement suggestions
* Test coverage warnings
* Maintainability feedback

---

## 🧭 Project Goals

This project is built to demonstrate:

* Real-world AI agent workflows
* LLM orchestration beyond chat interfaces
* Tool integration with external platforms
* AI as a developer productivity system

---

## 🚀 Future Improvements

* Priority & severity scoring
* Confidence levels per finding
* Review analytics
* Multi-PR batch reviews

---

## 👨‍💻 Author

**Krish Patel**

AI / GenAI / LLM Application Engineer

---

## ⭐ If you found this interesting

Give it a star — it helps the project reach more developers.
