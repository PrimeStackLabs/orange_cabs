import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  durationDays: { type: Number, required: true },
  durationNights: { type: Number, required: true },
  startCity: { type: String, required: true },
  destinations: [{ type: String }],
  startingPrice: { type: Number, required: true },
  image: { type: String, required: true },
  highlights: [{ type: String }],
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Package', packageSchema);
