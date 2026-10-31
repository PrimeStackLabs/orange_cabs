import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  licenseNumber: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  experienceYears: { type: Number, default: 5 },
  rating: { type: Number, default: 4.8 },
  totalTrips: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  status: { 
    type: String, 
    enum: ['available', 'on_trip', 'off_duty', 'suspended'], 
    default: 'available' 
  },
  documents: {
    licenseDoc: String,
    aadhaarDoc: String,
    policeVerification: Boolean
  },
  currentLocation: {
    city: { type: String, default: 'Bangalore' },
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

export default mongoose.model('Driver', driverSchema);
