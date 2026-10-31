import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, default: 'General Enquiry' },
  message: { type: String, required: true },
  source: { type: String, enum: ['contact_form', 'chatbot', 'quick_enquiry'], default: 'contact_form' },
  status: { type: String, enum: ['New', 'Replied', 'Closed'], default: 'New' },
  isRead: { type: Boolean, default: false },
  replyMessage: { type: String, default: '' },
  repliedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Enquiry', enquirySchema);
