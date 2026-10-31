import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Check, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import api from '../services/api';

const DEFAULT_PACKAGES = [
  {
    _id: 'p1',
    title: 'Mysore & Coorg Heritage & Hills Tour',
    slug: 'mysore-coorg-heritage-hills',
    durationDays: 4,
    durationNights: 3,
    startCity: 'Bangalore',
    destinations: ['Mysore Palace', 'Chamundi Hills', 'Madikeri Fort', 'Abbey Falls'],
    startingPrice: 13999,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    highlights: ['Private Chauffeur-driven AC Sedan / SUV', 'Driver allowance and fuel included'],
    itinerary: [
      { day: 1, title: 'Bangalore to Mysore & Royal Sightseeing', description: 'Pickup from Bangalore, scenic expressway drive to Mysore, visit majestic Mysore Palace.' },
      { day: 2, title: 'Mysore to Coorg (Scotland of India)', description: 'Visit Chamundi Hill Temple, drive to Madikeri. Sunset at Raja Seat.' },
      { day: 3, title: 'Coorg Natural Wonders & Waterfalls', description: 'Excursion to Abbey Falls, Dubare Elephant Camp, and Golden Temple.' },
      { day: 4, title: 'Coorg to Bangalore Return', description: 'Coffee spice plantation walk and scenic drive back to Bangalore.' }
    ],
    inclusions: ['Dedicated AC Cab for all 4 Days', 'Fuel charges, driver allowances & toll taxes'],
    exclusions: ['Hotel stays & meals', 'Entry monument tickets']
  },
  {
    _id: 'p2',
    title: 'Ooty & Coonoor Nilgiri Mountain Splendor',
    slug: 'ooty-coonoor-mountain-splendor',
    durationDays: 3,
    durationNights: 2,
    startCity: 'Bangalore',
    destinations: ['Bandipur Safari', 'Botanical Gardens Ooty', 'Doddabetta Peak'],
    startingPrice: 11499,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    highlights: ['Toy Train experience coordination', 'Mountain hairpin bend certified chauffeur'],
    itinerary: [
      { day: 1, title: 'Bangalore to Ooty via Bandipur', description: 'Early morning pickup, drive through Bandipur National Park.' },
      { day: 2, title: 'Ooty & Coonoor Sightseeing', description: 'Visit Doddabetta peak, Ooty Lake boating, Botanical Garden.' },
      { day: 3, title: 'Pykara Falls & Return to Bangalore', description: 'Visit Pykara lake and drive back to Bangalore.' }
    ],
    inclusions: ['All Cab Transfers', 'Driver night allowance', 'Permit taxes'],
    exclusions: ['Personal expenses', 'Activity tickets']
  },
  {
    _id: 'p3',
    title: 'Chikmagalur Coffee Estate Retreat',
    slug: 'chikmagalur-coffee-retreat',
    durationDays: 2,
    durationNights: 1,
    startCity: 'Bangalore',
    destinations: ['Mullayanagiri Peak', 'Baba Budangiri', 'Belur & Halebidu Temples'],
    startingPrice: 7999,
    image: 'https://images.unsplash.com/photo-1626014303757-64663378546b?auto=format&fit=crop&w=800&q=80',
    highlights: ['Highest peak in Karnataka', 'Coffee tasting experience'],
    itinerary: [
      { day: 1, title: 'Bangalore to Chikmagalur via Belur', description: 'Visit 12th century Chennakeshava Temple at Belur, proceed to Chikmagalur.' },
      { day: 2, title: 'Baba Budangiri, Coffee plantation & Return', description: 'Explore Baba Budangiri caves and return to Bangalore.' }
    ],
    inclusions: ['All transportation in private vehicle', 'All tolls and parking'],
    exclusions: ['Stay', 'Food']
  }
];

const TourPackagesPage = () => {
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get('/packages');
        if (data.success) {
          setPackages(data.packages);
        }
      } catch (err) {
        console.error('Error fetching tour packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      {/* Page Header (Dark Obsidian with Map Pattern) */}
      <section className="page-hero-surface relative pt-12 pb-20 border-b border-white/10 text-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-orange/40 text-orange text-xs font-bold uppercase tracking-wider mb-4 shadow-glow-orange">
            <Sparkles className="w-4 h-4 text-orange" /> Curated Road Experiences
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-white mt-2">
            South India Tour Packages
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mt-3 font-light leading-relaxed max-w-2xl mx-auto">
            All-inclusive holiday road trips with private chauffeur-driven AC cabs, fuel, permits, and driver allowance covered.
          </p>
        </div>
      </section>

      {/* Packages Grid (Clean Light Section Matching Reference Screenshot) */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div>
                  <div className="h-56 relative overflow-hidden bg-slate-100">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange text-white text-xs font-bold shadow-glow-orange">
                      {pkg.durationDays} Days / {pkg.durationNights} Nights
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs text-white bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      Departs: {pkg.startCity}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-orange transition-colors">
                      {pkg.title}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {pkg.destinations.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 space-y-1.5">
                      {pkg.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-orange flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
                    <span className="font-heading font-black text-2xl text-orange">
                      ₹{pkg.startingPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="px-4 py-2 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs font-bold shadow-glow-orange transition-all"
                  >
                    View Itinerary
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Package Details Modal */}
          {selectedPackage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-2xl text-slate-900">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-orange text-white text-xs font-bold">
                    {selectedPackage.durationDays}D / {selectedPackage.durationNights}N
                  </span>
                  <span className="text-xs text-slate-500">Starting from {selectedPackage.startCity}</span>
                </div>

                <h2 className="font-heading font-extrabold text-2xl text-slate-900 mb-4">
                  {selectedPackage.title}
                </h2>

                {/* Day by Day Itinerary */}
                <div className="space-y-4 my-6">
                  <h4 className="font-heading font-bold text-sm text-orange uppercase tracking-wider">
                    Detailed Itinerary
                  </h4>
                  {selectedPackage.itinerary.map((item) => (
                    <div key={item.day} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-orange">Day {item.day}: {item.title}</span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Inclusions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <h5 className="font-bold text-xs text-emerald-700 mb-2">Package Inclusions</h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {selectedPackage.inclusions.map((inc, i) => (
                        <li key={i}>✓ {inc}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                    <h5 className="font-bold text-xs text-red-700 mb-2">Exclusions</h5>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {selectedPackage.exclusions.map((exc, i) => (
                        <li key={i}>✕ {exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Total Package Starting</span>
                    <span className="font-heading font-black text-2xl text-orange">
                      ₹{selectedPackage.startingPrice.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/book?drop=${encodeURIComponent(selectedPackage.destinations[0] || 'Mysore')}&tripType=outstation_round`}
                    className="btn-shine px-6 py-2.5 rounded-xl bg-orange hover:bg-orange-dark text-white font-bold text-sm shadow-glow-orange"
                  >
                    Book This Tour
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default TourPackagesPage;
