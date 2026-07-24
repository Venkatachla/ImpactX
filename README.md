# 🚀 ImpactX – If I Change This Code, What Breaks?

> **An AI-powered code impact analysis platform that predicts what may break before you commit your code.**

---

## 📌 Overview

ImpactX helps developers understand the consequences of code changes before they merge or deploy them. Instead of manually tracing dependencies across hundreds of files, ImpactX builds a dependency graph, analyzes modified code, and uses AI to identify components that could be affected.

The goal is to reduce regressions, improve code quality, and accelerate development by providing intelligent impact analysis in real time.

---

## ✨ Features

* 🔍 Repository-wide dependency graph generation
* 📂 Git diff analysis for changed files
* 🧠 AI-generated impact analysis
* ⚠️ Potential breakage prediction
* 📊 Interactive dependency visualization
* 🔄 Incremental graph updates for changed files
* 📄 File-level and function-level dependency tracking
* 🌐 REST API built with FastAPI
* ⚛️ React-based frontend dashboard
* 📦 GitHub repository support

---

## 🏗️ System Architecture

```text
               GitHub Repository
                      │
                      ▼
              Repository Scanner
                      │
                      ▼
          Dependency Graph Generator
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   Graph Database           Git Diff Parser
          │                       │
          └───────────┬───────────┘
                      ▼
            Impact Analysis Engine
                      │
                      ▼
                 AI Suggestion
                      │
                      ▼
             React Visualization UI
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* CSS

## Backend

* FastAPI
* Python
* Uvicorn

## AI

* OpenAI API
* AST Parsing
* Dependency Analysis

## Version Control

* Git
* GitHub

---

# 📁 Project Structure

```text
ImpactX/
│
├── backend/
│   ├── main.py
│   ├── analyzer.py
│   ├── graph.py
│   ├── ai.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/<your-username>/ImpactX.git
cd ImpactX
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run backend

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at

```
http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run development server

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
OPENAI_API_KEY=your_openai_api_key
```

If your project uses GitHub APIs:

```env
GITHUB_TOKEN=your_github_token
```

---

# 🚀 API Endpoints

| Method | Endpoint   | Description                  |
| ------ | ---------- | ---------------------------- |
| GET    | `/health`  | Health check                 |
| POST   | `/analyze` | Analyze repository           |
| POST   | `/impact`  | Predict impacted files       |
| POST   | `/graph`   | Generate dependency graph    |
| POST   | `/suggest` | AI-generated recommendations |

> **Note:** Replace the endpoint list with your actual routes if they differ.

---

# 🔄 Workflow

1. User selects or uploads a Git repository.
2. Backend scans the repository.
3. Source files are parsed.
4. Dependency graph is generated.
5. Git diff identifies changed files.
6. Only affected nodes are updated incrementally.
7. AI analyzes the dependency graph and code changes.
8. Potential breakages are predicted.
9. Suggestions are displayed in the frontend.

---

# 🧠 How It Works

### 1. Repository Scanning

The backend traverses the project and identifies supported source files.

### 2. Dependency Extraction

Relationships between files, modules, classes, and functions are extracted to build a dependency graph.

### 3. Change Detection

Git diff is used to identify modified files and changed lines.

### 4. Incremental Updates

Instead of rebuilding the entire graph, only impacted portions are refreshed for faster analysis.

### 5. AI Reasoning

The AI combines dependency information and code changes to estimate:

* Which modules are affected
* Possible runtime failures
* Missing imports
* Broken APIs
* Cascading dependency impacts
* Suggested testing priorities

---

# 📊 Example Output

```text
Changed File:
backend/auth.py

Potentially Impacted Files:
✔ backend/login.py
✔ backend/session.py
✔ backend/user.py

Risk Level:
High

Confidence:
92%

Suggested Tests:
• Authentication
• Session Management
• User Login
```

---

# 🎯 Use Cases

* Pull request reviews
* Refactoring analysis
* Legacy code understanding
* Continuous Integration (CI)
* Regression prevention
* Dependency visualization
* Team onboarding

---

# 🌟 Future Enhancements

* Multi-language support (Java, C++, Go, Rust, JavaScript, Python)
* Real-time IDE extension
* GitHub Pull Request integration
* CI/CD pipeline integration
* Interactive dependency graph
* Severity scoring
* Historical impact analytics
* Automated test case recommendation
* LLM-assisted code review
* Distributed graph storage for large repositories

---

# 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

# 👥 Team

**Glitch in the Matrix**

Hackathon Project

Team Members

* Venkatachala V
* Rohith Gowda K
* Praveen Devamane

---

# 🙏 Acknowledgements

* FastAPI
* React
* OpenAI API
* Git
* GitHub
* Vite

---

## ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork it
* 🐞 Report issues
* 💡 Suggest improvements

Your feedback helps make ImpactX even better!

