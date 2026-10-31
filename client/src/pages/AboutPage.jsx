import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  HeartHandshake, 
  Car, 
  Users, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Star,
  Building2,
  Check,
  Phone
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';

export default function AboutPage() {
  const { openBookingModal } = useBookingModal();

  const corePillars = [
    {
      title: 'Certified Safety & Defense',
      desc: 'Rigorous 100% background-checked chauffeurs, real-time GPS telematics, speed governors, and 24/7 SOS dispatch room.',
      image: '/images/SAFETY.jpg'
    },
    {
      title: 'Statutory Compliance',
      desc: '100% commercial registration compliance, comprehensive passenger insurance, certified fitness certificates, and GST billing.',
      image: '/images/COMPLIANCE.jpg'
    },
    {
      title: 'Green & Sustainable Mobility',
      desc: 'Active introduction of CNG and electric vehicles (EV) to help enterprise partners fulfill their ESG decarbonization goals.',
      image: '/images/SUSTAINABILITY.jpg'
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Page Header */}
      <section className="page-hero-surface relative py-20 sm:py-24 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="badge-pill-orange">About Orange Cabs</span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Redefining Executive Transportation
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Founded with a commitment to integrity, punctuality, and passenger peace of mind across South India.
          </p>
        </div>
      </section>

      {/* Main Story & Leadership */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Featured Fleet Image */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="/images/fleet/executive-sedan.jpg"
                  alt="Executive sedan from the Orange Cabs premium fleet"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010]/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                    Orange Cabs Premium Fleet
                  </span>
                  <p className="mt-2 font-heading text-2xl font-black sm:text-3xl">
                    Every journey, elevated.
                  </p>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="badge-pill-red">Our Story &amp; Heritage</span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
                Built on Trust, Precision, and Unwavering Commitment
              </h2>

              <p className="text-base text-gray-600 leading-relaxed">
                Orange Cabs was established to address the critical gaps in intercity and corporate employee transportation: unpredictable surge tariffs, last-minute cancellations, and lack of driver accountability.
              </p>

              <p className="text-base text-gray-600 leading-relaxed">
                Today, Orange Cabs operates one of Bangalore's most reliable premium fleets, providing airport transfers, dedicated enterprise rosters, executive sedans, Toyota Innovas, and luxury tourist coaches to over 100 enterprise clients and thousands of private travelers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="p-4 rounded-2xl bg-gray-50 text-center">
                  <strong className="text-2xl font-heading font-black text-brandRed block">10,000+</strong>
                  <span className="text-xs text-gray-500 font-medium">Successful Trips</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 text-center">
                  <strong className="text-2xl font-heading font-black text-accentOrange block">99.8%</strong>
                  <span className="text-xs text-gray-500 font-medium">On-Time Record</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 text-center col-span-2 sm:col-span-1">
                  <strong className="text-2xl font-heading font-black text-charcoal block">100+</strong>
                  <span className="text-xs text-gray-500 font-medium">Corporate Partners</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3 Core Operating Pillars */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill-orange mb-3">Enterprise Governance</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
              Our Pillars of Excellence
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              We uphold the highest benchmarks of safety, compliance, and environmental stewardship across every kilometre travelled.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePillars.map((pillar, idx) => (
              <div key={idx} className="luxury-card overflow-hidden flex flex-col group">
                <div className="h-52 overflow-hidden bg-gray-100">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/fleet/innova-hycross.jpg';
                    }}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-charcoal group-hover:text-brandRed transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-charcoal">
            Ready to Travel with Orange Cabs?
          </h2>
          <p className="text-sm text-gray-600">
            Book your journey online or contact our enterprise team for customized corporate proposals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openBookingModal()}
              className="btn-primary text-xs sm:text-sm !py-3 !px-7"
            >
              <span>Book Your Ride</span>
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openCorporateProposal'))}
              className="btn-outline-dark text-xs sm:text-sm !py-3 !px-7"
            >
              <Building2 className="w-4 h-4" />
              <span>Corporate Inquiries</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
