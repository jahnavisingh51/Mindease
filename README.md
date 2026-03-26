# 🧠 AI Mental Health Support SaaS Platform

## 📌 Overview

This project is an AI-powered Mental Health Support Platform designed to provide early emotional assistance through intelligent chat, mood tracking, and analytics.

⚠️ **Disclaimer:** This application is NOT a replacement for professional therapy. It is designed to provide early support and encourage users to seek professional help when needed.

---

## 🚀 Features

### 🔐 Authentication

* User Registration & Login (JWT-based authentication)
* Secure password hashing using bcrypt

### 💬 AI Chat Support

* Users can send messages and receive AI-generated supportive responses
* Basic emotion detection (stress, anxiety, happy, neutral)
* Chat history storage

### 😊 Mood Tracking

* Log daily mood (scale-based or labels)
* Track emotional trends over time

### 📊 Dashboard

* View user activity
* Mood analytics
* Chat statistics

### 🛡️ Security

* JWT protected routes
* Input validation using Pydantic
* Error handling & logging

---

## 🏗️ Tech Stack

### Backend

* FastAPI (Python)
* PostgreSQL (SQLAlchemy ORM)
* JWT Authentication (python-jose)
* NLP: NLTK / Scikit-learn

### Frontend

* React (Vite)
* Axios (API calls)

---

## 📁 Project Structure

```
project/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── middleware/
│   ├── config/
│   └── main.py
│
├── frontend/
│   ├── src/
│   └── components/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Backend Setup

```
cd backend
python -m venv venv
ven
```
