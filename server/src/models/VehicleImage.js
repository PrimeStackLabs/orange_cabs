import mongoose from 'mongoose';

const vehicleImageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/webp']
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('VehicleImage', vehicleImageSchema);
