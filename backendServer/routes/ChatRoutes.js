import express from 'express';
import Chat from '../models/Chat.js';
import axios from 'axios';

const router = express.Router();

// Function to get bot response
const getBotResponse = async (message) => {
    try {
        console.log('🔵 [Backend] Sending message to autogen server:', message);
        const response = await axios.post('http://localhost:5001/api/chat', {
            message: message
        });
        console.log('🟢 [Backend] Received response from autogen server:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('🔴 [Backend] Error getting bot response:', error.message);
        if (error.response) {
            console.error('🔴 [Backend] Autogen server response:', error.response.data);
        }
        throw error;
    }
};

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
        console.log('🔵 [Backend] Updating chat:', { id, role, content });
        const chat = await Chat.findById(id);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        // Add user message to chat
        chat.messages.push({ role, content });
        await chat.save();
        console.log('🟢 [Backend] User message saved to chat');

        // If the message is from the user, get bot response
        if (role === 'user') {
            try {
                console.log('🔵 [Backend] Getting bot response for message:', content);
                const botResponse = await getBotResponse(content);
                console.log('🟢 [Backend] Adding bot response to chat:', JSON.stringify(botResponse, null, 2));
                // Add bot's response to the chat
                chat.messages.push(botResponse);
                await chat.save();
                console.log('🟢 [Backend] Bot response saved to chat');
            } catch (error) {
                console.error('🔴 [Backend] Error getting bot response:', error.message);
                // Still return the chat with the user's message even if bot fails
            }
        }

        console.log('🟢 [Backend] Sending updated chat to frontend:', JSON.stringify(chat, null, 2));
        res.status(200).json(chat);
    } catch (error) {
        console.error('🔴 [Backend] Error updating chat:', error.message);
        res.status(500).json({ message: 'Failed to update chat' });
    }
});

// מחיקת שיחה
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const chat = await Chat.findByIdAndDelete(id);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: 'Failed to delete chat' });
    }
});

export default router;