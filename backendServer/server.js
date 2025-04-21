import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chatRoutes from './routes/ChatRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/chats', chatRoutes);

// app.get('/', (req, res) => {
//     res.send('Server is running...');
// });

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

