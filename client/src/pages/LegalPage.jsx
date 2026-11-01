import React, { useState } from 'react';
import { Shield, FileText, RefreshCw } from 'lucide-react';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-navy text-softWhite pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="page-hero-surface text-center max-w-xl mx-auto rounded-3xl border border-white/10 px-6 py-10 sm:px-10 sm:py-12">
          <span className="text-xs font-bold text-orange tracking-widest uppercase">
            Legal & Customer Protections
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white mt-1">
            Policies & Commitments
          </h1>
        </div>

        {/* Tab buttons */}
        <div className="flex rounded-2xl glass p-1.5 border border-white/10 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'terms' ? 'bg-orange text-white shadow-glow-orange' : 'text-gray-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'privacy' ? 'bg-orange text-white shadow-glow-orange' : 'text-gray-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'refund' ? 'bg-orange text-white shadow-glow-orange' : 'text-gray-400 hover:text-white'
            }`}
          >
            Refund Policy
          </button>
        </div>

        {/* Content */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 text-sm text-gray-300 space-y-6 leading-relaxed font-light">
          {activeTab === 'terms' && (
            <>
              <h2 className="font-heading font-bold text-xl text-white">1. Service Booking Terms</h2>
              <p>
                Orange Cars provides on-demand intercity, airport transfer, and local chauffeur cab services across Karnataka and neighboring southern states. By creating a booking, you agree to comply with safe passenger guidelines and adhere to scheduled pickup times.
              </p>
              <h2 className="font-heading font-bold text-xl text-white">2. Transparent Fare Guarantee</h2>
              <p>
                All bookings include designated base kilometers, driver allowances, and estimated tolls. Any excess distance traveled beyond the agreed package will be billed strictly at the category per-km rate.
              </p>
              <h2 className="font-heading font-bold text-xl text-white">3. Zero Hidden Charges</h2>
              <p>
                Our billing includes state GST and standard driver day allowances. No roadside negotiation or sudden surcharge is permitted by Orange Cars partners.
              </p>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <h2 className="font-heading font-bold text-xl text-white">1. Information Collection</h2>
              <p>
                We only collect your name, contact phone number, email address, and trip destinations to dispatch vehicles, generate GST invoices, and send real-time driver tracking links via SMS/WhatsApp.
              </p>
              <h2 className="font-heading font-bold text-xl text-white">2. Payment Security</h2>
              <p>
                We never store credit card or CVV details on our servers. All digital transactions are processed through encrypted 256-bit bank gateways.
              </p>
            </>
          )}

          {activeTab === 'refund' && (
            <>
              <h2 className="font-heading font-bold text-xl text-white">1. Cancellation Window</h2>
              <p>
                You may cancel your booking free of charge up to 2 hours before the scheduled pickup time directly via your dashboard or by calling our 24x7 desk.
              </p>
              <h2 className="font-heading font-bold text-xl text-white">2. 100% Instant Refund</h2>
              <p>
                If a prepaid booking is cancelled within the allowed window or in the rare event of service disruption, refunds are automatically credited back to your original payment method within 24 to 48 hours.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default LegalPage;
