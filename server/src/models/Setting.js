import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  brandName: { type: String, default: 'Orange Cab' },
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
    metaTitle: { type: String, default: 'Orange Cab | Premium Intercity & Airport Mobility Solutions' },
    metaDescription: { type: String, default: 'Experience luxury, punctual and certified chauffeur-driven cab booking across Bangalore and all major Indian cities with Orange Cab.' },
    keywords: { type: String, default: 'cab booking, outstation taxi, airport transfer, corporate mobility, luxury cabs' }
  },
  hero: {
    headline: { type: String, default: 'Premium Mobility, Redefined For Every Journey' },
    subheadline: { type: String, default: 'Experience effortless outstation and corporate rides with 100% verified chauffeurs, instant confirmations, and zero surge anxiety.' }
  },
  about: {
    story: { type: String, default: 'Founded in 2016, Orange Cab was born out of a clear mission: to bring true luxury, uncompromised safety, and absolute punctuality to intercity and corporate travel in India.' },
    badge: { type: String, default: 'Since 2016' },
    founderMessage: { type: String, default: 'Our commitment is simple — every single guest deserves a spotless vehicle, an impeccably trained chauffeur, and absolute peace of mind.' },
    founderName: { type: String, default: 'Vikramaditya Rao' },
    founderTitle: { type: String, default: 'Founder & CEO, Orange Cab' },
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
