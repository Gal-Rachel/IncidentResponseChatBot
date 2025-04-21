import express from 'express';
import axios from 'axios';

const router = express.Router();

// Function to generate bot response using autogen server
const generateBotResponse = async (message) => {
    try {
        const response = await axios.post('http://localhost:5001/api/chat', {
            message: message
        });
        return response.data;
    } catch (error) {
        console.error('Error generating bot response:', error);
        throw error;
    }
};

// Endpoint to get bot response
router.post('/response', async (req, res) => {
    const { message } = req.body;
    try {
        const botResponse = await generateBotResponse(message);
        res.status(200).json(botResponse);
    } catch (error) {
        console.error('Error getting bot response:', error);
        res.status(500).json({ message: 'Failed to get bot response' });
    }
});

export default router; 