const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chatbot/message", (req, res) => {
    const userMessage = req.body.message;

    let botResponse = "I'm still learning how to answer you! 🤖";

    res.json({ response: botResponse });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
