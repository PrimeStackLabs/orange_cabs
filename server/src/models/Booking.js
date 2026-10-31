import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true }, // e.g. OC-2026-00001
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  cabType: { 
    type: String, 
    required: true,
    default: 'Sedan'
  },
  passengers: { type: Number, default: 1 },
  message: { type: String, default: '' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Assigned', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  estimatedFare: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  source: { type: String, default: 'Website Modal' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
