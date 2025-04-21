import axios from 'axios';
const API_URL = 'http://localhost:5000/api/chats';

// יצירת שיחה חדשה
export const createChat = async (title, messages) => {
    try {
        const response = await axios.post(API_URL, { title, messages });
        return response.data;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
    }
};

// שליפת כל השיחות
export const getChats = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
    }
};

// שליפת שיחה לפי ID
export const getChatById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat by ID:', error);
        throw error;
    }
};

// עדכון שיחה
export const updateChat = async (id, role, content) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, { role, content });
        return response.data;
    } catch (error) {
        console.error('Error updating chat:', error);
        throw error;
    }
};