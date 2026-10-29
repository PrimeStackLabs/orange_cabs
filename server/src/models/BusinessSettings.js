const mongoose = require('mongoose');

const businessSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: 'SKB Tour and Travels',
    },
    ownerName: {
      type: String,
      default: 'Vicky',
    },
    primaryPhone: {
      type: String,
      default: '7338140524',
    },
    alternatePhone: {
      type: String,
      default: '9035897960',
    },
    whatsappNumber: {
      type: String,
      default: '917338140524',
    },
    contactEmail: {
      type: String,
      default: 'vickymegha903@gmail.com',
    },
    locationArea: {
      type: String,
      default: 'Airport Area, Devanahalli',
    },
    city: {
      type: String,
      default: 'Bengaluru',
    },
    state: {
      type: String,
      default: 'Karnataka',
    },
    pinCode: {
      type: String,
      default: '560300',
    },
    googleMapsUrl: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: 'Safe Journey, Happy Memories',
    },
    bookingTerms: {
      type: String,
      default: 'Fares subject to confirmation based on peak hours, toll charges and parking. Driver night allowance applicable between 10 PM and 6 AM.',
    },
    aboutSummary: {
      type: String,
      default: 'SKB Tour and Travels provides premium airport transfers, outstation tours, and corporate fleet services across Bengaluru and South India with verified professional chauffeurs.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BusinessSettings', businessSettingsSchema);
