import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters long'] },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Staff', 'Manager', 'Support'], 
    default: 'Super Admin' 
  },
  phone: { type: String, default: '+91 99999 99999' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  loginLogs: [{
    ip: String,
    device: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Admin', adminSchema);
