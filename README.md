# Atharva Portfolio RAG Chatbot

An AI-powered portfolio assistant built to answer questions about
Atharva's projects, skills, experience, resume, and technical
background.

The chatbot uses Retrieval-Augmented Generation (RAG) to retrieve
relevant portfolio information from MongoDB Atlas and generate grounded
answers using Groq.

## 🌐 Live Demo

-   **Portfolio:** https://atharva-portfolio-opal.vercel.app/
-   **Backend API:** https://atharva-portfolio-api.onrender.com
-   **Health Check:** https://atharva-portfolio-api.onrender.com/health

------------------------------------------------------------------------

## ✨ Features

-   🤖 AI-powered portfolio chatbot
-   🧠 Retrieval-Augmented Generation (RAG)
-   🔎 Semantic vector search with MongoDB Atlas Vector Search
-   🗂️ Intent-aware retrieval for projects, skills, experience, and
    general questions
-   💬 Conversation-aware follow-up questions
-   📝 Markdown-formatted AI responses
-   🔐 Secure public conversation sessions using conversation tokens
-   🚦 API rate limiting
-   ✅ Request validation
-   🛡️ Safe global exception handling
-   🌐 Production-ready CORS configuration
-   ⚡ FastAPI backend
-   🧩 CPU-only sentence-transformer embeddings
-   ☁️ Render backend deployment
-   ▲ Vercel frontend deployment

------------------------------------------------------------------------

## 🏗️ Architecture

``` text
Visitor
   │
   ▼
React / Vite Portfolio
        │
        │ POST /api/chat
        ▼
FastAPI Backend (Render)
        │
        ├── Request Validation
        ├── Rate Limiting
        ├── Conversation Handling
        └── Intent / Query Understanding
                │
                ▼
        Sentence Transformers
        all-MiniLM-L6-v2
                │
                ▼
        MongoDB Atlas
        Vector Search
                │
                ▼
        Relevant Portfolio Chunks
                │
                ▼
        Groq LLM
        openai/gpt-oss-20b
                │
                ▼
        Grounded Markdown Response
                │
                ▼
        Chatbot UI
```

------------------------------------------------------------------------

## 🔄 How It Works

### 1. User asks a question

Example:

``` text
What projects has Atharva worked on?
```

### 2. Frontend sends the request

The React chatbot sends the message to:

``` text
POST /api/chat
```

The production API URL is supplied through the Vite environment variable
`VITE_API_URL`.

### 3. Conversation context is handled

Public conversations use:

-   `conversation_id`
-   `conversation_token`

The raw conversation token is not stored directly; its SHA-256 hash is
stored and verified using a constant-time comparison.

Recent conversation messages are also used to understand follow-up
questions.

### 4. Query understanding

The backend detects a broad intent such as:

-   `project`
-   `skill`
-   `experience`
-   `general`

Follow-up questions can also be expanded using recent conversation
context.

### 5. Embedding generation

The retrieval query is converted into a vector using:

``` text
all-MiniLM-L6-v2
```

The embedding model is loaded lazily so application startup is not
blocked by model initialization.

### 6. Vector retrieval

MongoDB Atlas Vector Search retrieves semantically relevant portfolio
chunks.

For project questions, application-side intent prioritization and
duplicate-project reduction improve the retrieved context.

### 7. LLM generation

The retrieved context and recent conversation history are sent to Groq
using:

``` text
openai/gpt-oss-20b
```

The assistant is instructed to remain grounded in the portfolio
knowledge base.

When requested information is unavailable, it responds:

``` text
I don't have that information in my portfolio data.
```

### 8. Response rendering

The answer is returned to the React chatbot and rendered with Markdown
support.

------------------------------------------------------------------------

## 🧰 Tech Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   Framer Motion
-   Lenis
-   React Markdown

### Backend

-   Python
-   FastAPI
-   Uvicorn
-   Pydantic
-   SlowAPI
-   PyMongo

### AI / RAG

-   Groq
-   `openai/gpt-oss-20b`
-   Sentence Transformers
-   `all-MiniLM-L6-v2`
-   MongoDB Atlas Vector Search

### Database

-   MongoDB Atlas

### Deployment

-   Vercel --- Frontend
-   Render --- Backend
-   MongoDB Atlas --- Database

------------------------------------------------------------------------

## 📁 Backend Structure

``` text
rag-backend/
│
├── app/
│   ├── main.py
│   ├── database.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── conversations.py
│   │   └── resume.py
│   │
│   └── services/
│       ├── conversation.py
│       ├── embeddings.py
│       ├── intent.py
│       ├── llm.py
│       ├── public_session.py
│       ├── rate_limiter.py
│       └── retrieval.py
│
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
└── ...
```

------------------------------------------------------------------------

## 🔐 Environment Variables

### Backend

Create a `.env` file for local development:

``` env
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key

FRONTEND_URL=http://localhost:5173

EMAIL_TO=your_email
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=your_verified_sender
```

For production, configure these values in Render's environment settings.

### Frontend

Create `.env.local`:

``` env
VITE_API_URL=http://127.0.0.1:8000
```

For Vercel production:

``` env
VITE_API_URL=https://atharva-portfolio-api.onrender.com
```

> `VITE_API_URL` is intentionally browser-exposed because it contains
> only the public backend URL. Secrets such as database credentials and
> API keys must never use a `VITE_` prefix.

------------------------------------------------------------------------

## 🚀 Local Development

### 1. Clone the repository

``` powershell
git clone <your-repository-url>
cd rag-backend
```

### 2. Create a virtual environment

``` powershell
python -m venv .venv
```

Activate it:

``` powershell
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

``` powershell
pip install -r requirements.txt
```

The project uses CPU-only PyTorch for deployment efficiency:

``` text
torch==2.13.0+cpu
```

### 4. Configure environment variables

Create `.env` and add the required credentials.

### 5. Start the backend

``` powershell
uvicorn app.main:app --reload
```

The API will be available at:

``` text
http://127.0.0.1:8000
```

------------------------------------------------------------------------

## 🩺 API Health Check

``` text
GET /health
```

Expected response:

``` json
{
  "status": "healthy",
  "service": "rag-backend",
  "database": "connected"
}
```

------------------------------------------------------------------------

## 💬 Chat API

### Endpoint

``` text
POST /api/chat
```

The endpoint is intentionally public because portfolio visitors need to
use the chatbot without creating an account.

Public conversations are protected using secure conversation tokens.

Example request:

``` json
{
  "message": "Tell me about Atharva's projects"
}
```

------------------------------------------------------------------------

## 🔒 Security

### Conversation token security

Public users receive a secure random conversation token.

The backend stores a SHA-256 hash rather than the raw token and uses
constant-time comparison during verification.

### Rate limiting

The chat endpoint is limited to:

``` text
10 requests / minute
```

### Input validation

Chat messages are limited to:

``` text
1–2000 characters
```

Whitespace-only messages are rejected.

Conversation identifiers and request limits are validated before
processing.

### Conversation history

Only the latest 12 messages are included in the LLM conversation context
to prevent unbounded prompt growth.

### CORS

The backend allows the configured frontend origin.

### Environment secrets

Sensitive credentials are stored in environment variables and are not
committed to Git.

------------------------------------------------------------------------

## 🧠 RAG Design

The chatbot does not simply ask the LLM to generate information about
Atharva.

Instead:

``` text
User Question
      │
      ▼
Query Understanding
      │
      ▼
Embedding Generation
      │
      ▼
MongoDB Atlas Vector Search
      │
      ▼
Relevant Portfolio Chunks
      │
      ▼
Conversation Context
      │
      ▼
Groq LLM
      │
      ▼
Grounded Answer
```

This keeps responses focused on information available in the portfolio
knowledge base and reduces unsupported answers.

------------------------------------------------------------------------

## 🎯 Intent-Aware Retrieval

The retrieval layer detects broad question intent.

Examples:

``` text
"What projects has Atharva built?"
→ project
```

``` text
"What technologies does Atharva know?"
→ skill
```

``` text
"Tell me about Atharva's experience."
→ experience
```

For project questions, duplicate project chunks are reduced so retrieved
context can represent multiple projects more effectively.

------------------------------------------------------------------------

## 💭 Conversation-Aware Follow-Ups

The chatbot supports follow-up questions.

Example:

``` text
User:
Tell me about FlowForge.

Assistant:
...

User:
What technologies did he use for it?
```

Recent conversation context is used to help resolve the follow-up before
retrieval.

------------------------------------------------------------------------

## ⚡ Deployment

### Backend --- Render

Configuration:

``` text
Root Directory:
rag-backend

Build Command:
pip install -r requirements.txt

Start Command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Production backend:

``` text
https://atharva-portfolio-api.onrender.com
```

### Frontend --- Vercel

Production environment variable:

``` text
VITE_API_URL=https://atharva-portfolio-api.onrender.com
```

Production frontend:

``` text
https://atharva-portfolio-opal.vercel.app/
```

------------------------------------------------------------------------

## 🖼️ Screenshots

### Portfolio Landing Page

<img width="1816" height="858" alt="portfolio" src="https://github.com/user-attachments/assets/fae4ef87-af53-42e8-996a-4b5bb7723956" />

### AI Chatbot --- Closed

<img width="262" height="222" alt="chatbot_closed" src="https://github.com/user-attachments/assets/a4169fb8-664b-4494-b923-8475f0f7b22e" />

### AI Chatbot --- Open

<img width="455" height="580" alt="chatbot_open" src="https://github.com/user-attachments/assets/db021b01-8a65-47bd-b1fc-b4eb980b52be" />

### RAG Response

<img width="450" height="591" alt="response" src="https://github.com/user-attachments/assets/e70df72f-abff-4878-8ea5-0b5b08972b93" />

------------------------------------------------------------------------

## 🧪 Testing

The production deployment has been verified for:

-   Backend health
-   MongoDB connectivity
-   FastAPI startup
-   Production port binding
-   Vercel → Render communication
-   Chatbot responses
-   Conversation follow-ups
-   Markdown rendering
-   Public chatbot access
-   Rate limiting
-   Input validation

The live `/health` endpoint currently confirms:

``` json
{
  "status": "healthy",
  "service": "rag-backend",
  "database": "connected"
}
```

------------------------------------------------------------------------

## 🛠️ Deployment Issue & Resolution

During the initial Render deployment, the backend failed to bind its
port.

The dependency installation was pulling a large CUDA-enabled PyTorch
stack, including NVIDIA CUDA libraries, even though the portfolio
chatbot only requires CPU inference.

The project was changed to use:

``` text
torch==2.13.0+cpu
```

and the embedding model was changed to lazy loading.

After the changes, Render successfully started:

``` text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

and the production health check confirmed that the backend and MongoDB
connection were healthy.

------------------------------------------------------------------------

## 📌 Future Improvements

-   Production endpoint hardening
-   Improved follow-up query resolution
-   Dynamic project/entity resolution
-   Retrieval reranking
-   Automated tests
-   Better observability and logging
-   Improved cold-start performance
-   Additional portfolio data sources
-   Anonymous chatbot usage analytics
-   Deployment monitoring

------------------------------------------------------------------------

## 👨‍💻 Author

**Atharva Phanse**

Full-stack developer focused on building practical applications using
modern web technologies, AI, RAG systems, and cloud deployment.

### Portfolio

https://atharva-portfolio-opal.vercel.app/

------------------------------------------------------------------------

## 📄 License

This is a personal portfolio project.

Portfolio content, personal information, and original assets belong to
their respective owner.
