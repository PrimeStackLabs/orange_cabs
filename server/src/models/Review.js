import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorCity: { type: String, default: 'Bangalore' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  routeOrService: { type: String, default: 'Outstation Cab' },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
  featured: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
