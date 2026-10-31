import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  fromCity: { type: String, required: true },
  toCity: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  estimatedDuration: { type: String, required: true }, // e.g. "4.5 hrs"
  prices: {
    Sedan: { type: Number, required: true },
    SUV: { type: Number, required: true },
    Innova: { type: Number, required: true },
    TempoTraveller: { type: Number, required: true },
    Luxury: { type: Number, required: true }
  },
  popular: { type: Boolean, default: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80' },
  tagline: { type: String, default: 'Best rate guaranteed' }
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);
