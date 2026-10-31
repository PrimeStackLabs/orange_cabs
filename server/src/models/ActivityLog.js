import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g. "Booking Status Updated", "Driver Assigned", "Vehicle Added"
  details: { type: String, required: true },
  adminName: { type: String, default: 'System' },
  ip: { type: String },
  category: { 
    type: String, 
    enum: ['booking', 'driver', 'vehicle', 'pricing', 'system', 'auth'], 
    default: 'booking' 
  }
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);
