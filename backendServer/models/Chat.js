import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "bot"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Chat', chatSchema);
