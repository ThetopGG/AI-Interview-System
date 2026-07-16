# AI-Powered Interview System using RAG

An AI-powered interview platform that generates personalized technical interview questions based on a candidate's resume and the selected job role using Retrieval-Augmented Generation (RAG).

The system analyzes the uploaded resume, retrieves relevant concepts from a role-specific knowledge base, generates interview questions using an LLM, records candidate responses, and finally provides an AI-generated evaluation summary.

---

# Features

- Resume Upload (PDF)
- Resume Parsing using PyMuPDF
- Role Selection
- Retrieval-Augmented Generation (RAG)
- Semantic Search using ChromaDB
- Resume-aware Dynamic Question Generation
- AI-powered Interview Evaluation
- Interview Summary with Strengths & Areas of Improvement
- Modern React Frontend
- FastAPI Backend

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- Axios

## Backend

- FastAPI
- SQLAlchemy
- SQLite
- LangChain
- ChromaDB
- Sentence Transformers
- Groq LLM
- PyMuPDF

---

# System Architecture

```
                Resume PDF
                     │
                     ▼
              Resume Parser
               (PyMuPDF)
                     │
                     ▼
          Sentence Transformer
        (Text Embeddings)
                     │
                     ▼
              ChromaDB
        (Vector Database)
                     │
                     ▼
            Context Retrieval
                     │
                     ▼
             Groq LLM (RAG)
                     │
                     ▼
     Dynamic Interview Questions
                     │
                     ▼
          Candidate Answers
                     │
                     ▼
          AI Evaluation Summary
```

---

# Project Structure

```
AI-Interview-System

backend/
    app/
        api/
        models/
        rag/
        llm/
        services/
        schemas/
        core/

frontend/
    src/
        pages/
        components/
        api/
        store/
```

---

# Workflow

## Step 1

Candidate uploads resume.

↓

## Step 2

Resume is parsed using PyMuPDF.

↓

## Step 3

Candidate selects target role.

↓

## Step 4

Resume and role documents are embedded using Sentence Transformers.

↓

## Step 5

Relevant context is retrieved from ChromaDB.

↓

## Step 6

Groq LLM generates personalized interview questions.

↓

## Step 7

Candidate answers questions.

↓

## Step 8

System generates AI-powered evaluation.

---

# API Endpoints

## Resume

POST

```
/api/v1/resume/upload
```

---

## Roles

GET

```
/api/v1/roles
```

---

## Start Interview

POST

```
/api/v1/interview/start
```

---

## Next Question

POST

```
/api/v1/interview/{session_id}/next-question
```

---

## Submit Answer

POST

```
/api/v1/interview/{session_id}/answer
```

---

## Generate Summary

POST

```
/api/v1/summary/generate
```

---

# Setup

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

```
GROQ_API_KEY=YOUR_API_KEY

GROQ_MODEL_NAME=llama-3.3-70b-versatile
```

---

# Design Decisions

- FastAPI was selected for its high performance and clean API development.
- ChromaDB is used as the vector database for semantic retrieval.
- Sentence Transformers generate dense embeddings for resume and knowledge-base documents.
- LangChain orchestrates the Retrieval-Augmented Generation pipeline.
- Groq LLM is used for dynamic question generation and interview evaluation.
- React provides a responsive and interactive user experience.

---

# Future Improvements

- Voice Interview
- Authentication
- Recruiter Dashboard
- Adaptive Question Difficulty
- Multi-round Interviews
- Feedback Analytics
- Deployment on AWS


# Author

Satyam

