import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  sender: { type: String, enum: ['user', 'bot', 'agent'], required: true },
  text: { type: String, required: true },
  quickReplies: [{ label: String, action: String }],
  userName: { type: String, default: 'Guest' },
  userPhone: { type: String, default: '' },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('ChatMessage', chatMessageSchema);
