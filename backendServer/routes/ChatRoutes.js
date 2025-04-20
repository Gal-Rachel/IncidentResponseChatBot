import express from 'express';
import Chat from '../models/Chat.js';

const router = express.Router();

// יצירת שיחה חדשה
router.post('/new', async (req, res) => {
    try {
        const { title, messages } = req.body;
        const newChat = new Chat({ title, messages }); // שמירה של כל ההודעות ביחד
        await newChat.save();
        res.status(201).json(newChat);
    } catch (err) {
        console.error("Error creating new chat:", err);
        res.status(500).json({ error: 'Failed to create chat' });
    }
});


// נתיב חדש לשאול את ה-Agent
router.post('/ask-agent', async (req, res) => {
    const { message } = req.body;  // מקבל את ההודעה מהמשתמש

    try {
        // שולח את הבקשה לשרת ה-Python
        const response = await axios.post('http://localhost:5000/ask-agent', { message });

        // מחזיר את התשובה מה-Agent ל-Frontend
        res.json({ response: response.data.response });
    } catch (err) {
        console.error("Error asking agent:", err.message);
        res.status(500).json({ error: 'Error connecting to AutoGen server' });
    }
});

// שליפת כל ההיסטוריה
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ createdAt: -1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

// שליפת שיחה בודדת לפי ID
router.get('/:id', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch chat' });
    }
});

// עדכון שיחה קיימת והוספת הודעה חדשה
router.put('/:id', async (req, res) => {
    try {
        const { role, content } = req.body; // מצפה לשם השולח ותוכן ההודעה

        const chat = await Chat.findById(req.params.id);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        chat.messages.push({ role, content }); // הוספת ההודעה החדשה
        await chat.save();

        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update chat' });
    }
});

export default router;