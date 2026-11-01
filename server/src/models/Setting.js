import mongoose from 'mongoose';

const vehicleCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  minRate: { type: Number, required: true, min: 0 },
  maxRate: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  passengers: { type: Number, min: 1 }
}, { _id: false });

const outstationPricingSchema = new mongoose.Schema({
  minimumBillingDistance: { type: Number, default: 300, min: 300, max: 300 },
  tollParkingInfo: {
    type: String,
    default: 'Applicable toll and parking charges are itemized separately in your confirmed quote.'
  },
  driverAllowanceInfo: {
    type: String,
    default: 'Any applicable driver allowance is shown in your confirmed quote; no preset amount is displayed.'
  },
  otherChargesInfo: {
    type: String,
    default: 'Any other applicable charges are disclosed in your confirmed quote before travel.'
  },
  paymentDueInfo: {
    type: String,
    default: 'Final payment is due as stated in your confirmed quote or invoice.'
  }
}, { _id: false });

const settingSchema = new mongoose.Schema({
  brandName: { type: String, default: 'ORANGE CARS' },
  tagline: { type: String, default: 'Premium Intercity & Airport Mobility' },
  logoUrl: { type: String, default: '' },
  phone: { type: String, default: '+91 99999 99999' },
  whatsapp: { type: String, default: '919999999999' },
  email: { type: String, default: 'info@orangecab.in' },
  address: { type: String, default: 'Ground Floor, Prestige Meridian, MG Road, Bangalore 560001, India' },
  workingHours: { type: String, default: '24 Hours / 7 Days a Week' },
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com/orangecab' },
    instagram: { type: String, default: 'https://instagram.com/orangecab' },
    twitter: { type: String, default: 'https://x.com/orangecab' },
    youtube: { type: String, default: 'https://youtube.com/@orangecab' },
    linkedin: { type: String, default: 'https://linkedin.com/company/orangecab' },
    whatsapp: { type: String, default: 'https://wa.me/919999999999' },
    telegram: { type: String, default: 'https://t.me/orangecab' },
    pinterest: { type: String, default: 'https://pinterest.com/orangecab' }
  },
  seo: {
    metaTitle: { type: String, default: "ORANGE CARS | South India's Premier Mobility Company" },
    metaDescription: { type: String, default: 'Explore vehicle categories, per-kilometre rates, and booking services from ORANGE CARS.' },
    keywords: { type: String, default: 'cab booking, outstation taxi, airport transfer, corporate mobility, luxury cabs' }
  },
  hero: {
    headline: { type: String, default: "South India's Premier Mobility Company" },
    subheadline: { type: String, default: 'Your Journey, Our Priority.' }
  },
  vehicleCategories: {
    type: [vehicleCategorySchema],
    default: [
      { name: 'Hatchback', minRate: 12, maxRate: 12, image: '/images/fleet/maruti-dzire.webp', passengers: 4 },
      { name: 'Sedan', minRate: 14, maxRate: 14, image: '/images/fleet/skoda-superb.webp', passengers: 4 },
      { name: 'SUV', minRate: 22, maxRate: 22, image: '/images/fleet/innova-crysta-zx.webp', passengers: 7 },
      { name: 'Luxury Cars', minRate: 30, maxRate: 30, image: '/images/fleet/mercedes-eclass.webp', passengers: 4 },
      { name: 'Tempo Traveller', minRate: 20, maxRate: 28, image: '/images/fleet/force-urbania.webp', passengers: 13 }
    ]
  },
  outstationPricing: { type: outstationPricingSchema, default: () => ({}) },
  about: {
    story: { type: String, default: 'Founded in 2016, Orange Cab was born out of a clear mission: to bring true luxury, uncompromised safety, and absolute punctuality to intercity and corporate travel in India.' },
    badge: { type: String, default: 'Since 2016' },
    founderMessage: { type: String, default: 'Our commitment is simple — every single guest deserves a spotless vehicle, an impeccably trained chauffeur, and absolute peace of mind.' },
    founderName: { type: String, default: 'Vikramaditya Rao' },
    founderTitle: { type: String, default: 'Founder & CEO, ORANGE CARS' },
    founderPhoto: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' }
  },
  stats: {
    rides: { type: String, default: '50,000+' },
    onTime: { type: String, default: '99.8%' },
    cities: { type: String, default: '15+' },
    rating: { type: String, default: '4.9/5' }
  },
  chatbotQuickReplies: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
