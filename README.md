# 🛡️ Incident Response ChatBot

A full-stack chatbot application designed to assist with **incident response** in cybersecurity environments.  
It allows users to interact through a sleek chat interface, while automatically storing and organizing conversations in real-time.

---

## 🚀 Features

- 💬 **Chat interface** built with **React**
- 🧠 Conversation handling via chatbot logic
- 📁 **Chat history management** with clickable titles
- 💾 **Real-time saving** to **MongoDB Atlas**
- ⚙️ **Backend with Express** for chat processing and database interaction
- 🔁 Auto-updating interface — no page refresh needed

---

## 🧱 Tech Stack

| Frontend        | Backend          | Database        |
|-----------------|------------------|-----------------|
| React, Tailwind | Node.js, Express | MongoDB Atlas   |

---

## 📂 Project Structure

IncidentResponseChatBot/ 
    ├── client/ # React frontend 
        │ ├── components/ # Chat, MessageList, History, etc. 
        │ └── ... 
        ├── server/ # Express backend 
            │ ├── routes/ # API routes 
            │ ├── models/ # Mongoose schemas 
            │ └── ... 
            ├── .gitignore 
            ├── package.json 
    └── README.md

---

## 🛠️ Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/Gal-Rachel/IncidentResponseChatBot.git
cd IncidentResponseChatBot

2. Install dependencies:

Backend:
cd server
npm install

Frontend:
cd ../client
npm install

3. Configure environment variables:
Create a .env file in /server with the following:
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000

4. Run the project:
In two terminals:
Backend

cd server
npm start

Frontend
cd client
npm start
