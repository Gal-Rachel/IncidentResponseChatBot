import express from 'express';
import Chat from '../models/Chat.js';

const router = express.Router();

// יצירת שיחה חדשה
router.post('/', async (req, res) => {
    const { title, messages } = req.body;
    try {
        const newChat = new Chat({ title, messages });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Failed to create chat' });
    }
});

// שליפת כל השיחות
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ createdAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
});

// שליפת שיחה בודדת לפי ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const chat = await Chat.findById(id);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Failed to fetch chat' });
    }
});

// עדכון שיחה קיימת
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { role, content } = req.body;
    try {
        const chat = await Chat.findById(id);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        chat.messages.push({ role, content });
        await chat.save();
        res.status(200).json(chat);
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).json({ message: 'Failed to update chat' });
    }
});

export default router;