# Incident Response ChatBot 🛡️🤖

A smart assistant designed to help security analysts respond to cybersecurity incidents by generating tailored playbooks based on alerts received from Wazuh SIEM.  
Built using OpenAI AutoGen Agents, Python, and Node.js.

---

## 🚀 Features

- 🔍 Automatically analyzes Wazuh alerts
- 🧠 Uses AutoGen to dynamically generate incident response playbooks
- 🗨️ Interactive chatbot assistant to guide analysts
- 🌐 Backend written in Python + Node.js for full-stack capabilities

---

## 🛠️ Tech Stack

- Python 3.11
- [AutoGen (pyautogen)](https://github.com/microsoft/autogen)
- Node.js
- Flask (Python server)
- React

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Gal-Rachel/IncidentResponseChatBot.git
cd IncidentResponseChatBot
2. Install Python Dependencies
Make sure you're using Python 3.11 (AutoGen 0.2.0 requires Python >=3.8 and <3.12).

cd autogen-server
pip install -r requirements.txt
pip install pyautogen==0.2.0

3. Install Node.js Dependencies
If you're using a Node.js frontend/backend in your project:


cd ../your-node-folder-name
npm install
(Replace your-node-folder-name with the actual folder if needed)


🧪 Usage
Start the Python backend:

cd autogen-server
python app.py
Start the Node.js service (if applicable):

npm start
Interact with the chatbot interface to analyze and respond to Wazuh alerts dynamically.

🧑‍💻 Team
Gal
Rachel

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

💡 Notes
Make sure to add Python to your system PATH when installing.

Use Python 3.11 to ensure compatibility with pyautogen==0.2.0.


