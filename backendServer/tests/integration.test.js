import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
const AUTOGEN_URL = 'http://localhost:5001';

describe('Backend and Autogen Integration Tests', () => {
    let chatId;

    // Test creating a new chat
    test('Create new chat', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/chats`, {
            title: 'Test Chat',
            messages: []
        });
        expect(response.status).toBe(201);
        expect(response.data.title).toBe('Test Chat');
        chatId = response.data._id;
    });

    // Test sending a message and getting autogen response
    test('Send message and get autogen response', async () => {
        const message = {
            role: 'user',
            content: 'Hello, can you help me with incident response?'
        };

        const response = await axios.put(`${BACKEND_URL}/api/chats/${chatId}`, message);
        expect(response.status).toBe(200);

        // Verify the chat has both messages
        const messages = response.data.messages;
        expect(messages.length).toBe(2);
        expect(messages[0]).toEqual(message);
        expect(messages[1].role).toBe('assistant');
        expect(typeof messages[1].content).toBe('string');
        expect(messages[1].content.length).toBeGreaterThan(0);
    });

    // Test error handling
    test('Handle autogen server error gracefully', async () => {
        // Temporarily stop autogen server or use invalid URL
        const message = {
            role: 'user',
            content: 'Test error handling'
        };

        const response = await axios.put(`${BACKEND_URL}/api/chats/${chatId}`, message);
        expect(response.status).toBe(200);

        // Even if autogen fails, user message should be saved
        const messages = response.data.messages;
        expect(messages[messages.length - 1]).toEqual(message);
    });

    // Cleanup
    afterAll(async () => {
        if (chatId) {
            await axios.delete(`${BACKEND_URL}/api/chats/${chatId}`);
        }
    });
}); 