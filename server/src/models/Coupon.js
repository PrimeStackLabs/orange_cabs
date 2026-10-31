import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minTripFare: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 500 },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 },
  usageLimit: { type: Number, default: 500 },
  description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
