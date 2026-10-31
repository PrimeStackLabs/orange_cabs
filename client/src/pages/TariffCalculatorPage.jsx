import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Check, Car, Sparkles, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const TariffCalculatorPage = () => {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('outstation_oneway');
  const [distanceKm, setDistanceKm] = useState(150);
  const [cabType, setCabType] = useState('Sedan');
  const [days, setDays] = useState(1);
  const [fareResult, setFareResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateFare = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/fares/calculate', {
        tripType,
        distanceKm,
        cabType,
        days
      });
      if (data.success) {
        setFareResult(data.data);
      }
    } catch (err) {
      console.error('Failed to calculate tariff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateFare();
  }, [tripType, distanceKm, cabType, days]);

  const handleBookNow = () => {
    navigate(`/book?tripType=${tripType}&cabType=${cabType}&distance=${distanceKm}`);
  };

  return (
    <div className="relative pt-28 pb-20 overflow-hidden">
      {/* Page Header (Dark Obsidian with Map Pattern) */}
      <section className="page-hero-surface relative pt-12 pb-20 border-b border-white/10 text-center text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-orange/40 text-orange text-xs font-bold uppercase tracking-wider mb-4 shadow-glow-orange">
            <Sparkles className="w-4 h-4 text-orange" /> 100% Transparent Billing
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-white mt-2">
            Tariff & Price Calculator
          </h1>
          <p className="text-sm text-gray-300 mt-3 font-light max-w-2xl mx-auto">
            No hidden charges, zero surprise tolls, and guaranteed lowest per-km rates across Karnataka.
          </p>
        </div>
      </section>

      {/* Main Calculator Section (Clean Light Section Matching Reference Screenshot) */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Controls Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card-soft space-y-6">
              
              {/* Trip Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Trip Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'outstation_oneway', label: 'One-Way' },
                    { id: 'outstation_round', label: 'Round Trip' },
                    { id: 'local', label: 'Local (8h)' },
                    { id: 'airport', label: 'Airport' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTripType(t.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        tripType === t.id
                          ? 'bg-orange text-white shadow-glow-orange'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-700">Estimated Distance</label>
                  <span className="text-sm font-bold text-orange">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="800"
                  step="10"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-orange cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>20 km</span>
                  <span>250 km</span>
                  <span>500 km</span>
                  <span>800 km</span>
                </div>
              </div>

              {/* If Round Trip: Days selector */}
              {tripType === 'outstation_round' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-700">Total Trip Duration</label>
                    <span className="text-sm font-bold text-orange">{days} Day(s)</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDays(d)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          days === d ? 'bg-orange text-white shadow-glow-orange' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {d}D
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cab Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Cab Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Sedan', name: 'Sedan (Dzire/Etios)', rate: '₹13/km' },
                    { id: 'SUV', name: 'SUV (Ertiga/Carens)', rate: '₹18/km' },
                    { id: 'Innova', name: 'Innova Crysta Premium', rate: '₹22/km' },
                    { id: 'Tempo Traveller', name: 'Tempo (12-16 Seater)', rate: '₹28/km' },
                    { id: 'Luxury', name: 'Luxury (Mercedes E-Class)', rate: '₹45/km' }
                  ].map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCabType(c.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        cabType === c.id
                          ? 'bg-orange/10 border-orange text-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{c.name}</span>
                        <span className="text-xs text-orange font-mono font-bold">{c.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Results Column */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card-hover sticky top-28">
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange" />
                  Live Fare Estimate
                </h3>

                {fareResult && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 block">Selected Vehicle</span>
                      <span className="font-heading font-bold text-lg text-slate-900">
                        {fareResult.cabName}
                      </span>
                      <span className="text-xs text-emerald-600 block mt-1 font-medium">
                        {fareResult.chargeableDistanceKm} chargeable km ({fareResult.perKmRate} ₹/km)
                      </span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-600 pb-4 border-b border-slate-100">
                      <div className="flex justify-between">
                        <span>Base Vehicle Fare</span>
                        <span className="text-slate-900 font-medium">₹{fareResult.breakdown.baseFare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distance Charge</span>
                        <span className="text-slate-900 font-medium">₹{fareResult.breakdown.distanceFare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Driver Allowance</span>
                        <span className="text-slate-900 font-medium">₹{fareResult.breakdown.driverAllowance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tolls & Taxes</span>
                        <span className="text-slate-900 font-medium">₹{fareResult.breakdown.tollAndTaxes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (5%)</span>
                        <span className="text-slate-900 font-medium">₹{fareResult.breakdown.gst}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <div>
                        <span className="text-xs text-slate-500 block">Total Estimated Price</span>
                        <span className="text-[11px] text-emerald-600 font-medium">All inclusive</span>
                      </div>
                      <span className="font-heading font-black text-3xl text-orange">
                        ₹{fareResult.breakdown.totalFare.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleBookNow}
                      className="btn-shine w-full py-3.5 rounded-xl bg-orange hover:bg-orange-dark text-white font-bold text-sm shadow-glow-orange flex items-center justify-center gap-2 transition-all mt-4"
                    >
                      <span>Proceed to Book This Ride</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default TariffCalculatorPage;
