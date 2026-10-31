import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Client' },
  city: { type: String, default: 'Bangalore' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  comment: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  status: { type: String, enum: ['approved', 'pending'], default: 'approved' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
