import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Toyota Innova Crysta ZX"
  category: { 
    type: String, 
    required: true, 
    trim: true
  },
  registrationNumber: { type: String, required: true, unique: true },
  seatingCapacity: { type: Number, required: true },
  luggageCapacity: { type: Number, default: 2 },
  ac: { type: Boolean, default: true },
  perKmRate: { type: Number, required: true },
  baseFare: { type: Number, required: true },
  features: [{ type: String }],
  image: { type: String, required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'Electric'], default: 'Diesel' },
  modelYear: { type: Number, default: 2024 },
  status: { 
    type: String, 
    enum: ['available', 'on_trip', 'maintenance', 'inactive'], 
    default: 'available' 
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
