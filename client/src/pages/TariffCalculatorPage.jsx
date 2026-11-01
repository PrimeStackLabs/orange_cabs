import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';

const TariffCalculatorPage = () => {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('outstation_oneway');
  const [distanceKm, setDistanceKm] = useState(150);
  const [cabType, setCabType] = useState('Sedan');
  const [fareResult, setFareResult] = useState(null);
  const [rates, setRates] = useState({});
  const [minimumBillingDistance, setMinimumBillingDistance] = useState(300);
  const [loading, setLoading] = useState(false);
  const [fareError, setFareError] = useState('');

  useEffect(() => {
    api.get('/fares/rates')
      .then(({ data }) => {
        if (data.success) {
          setRates(data.rates || {});
          setMinimumBillingDistance(data.minimumBillingDistance || 300);
          setCabType((current) => (data.rates?.[current] ? current : Object.keys(data.rates || {})[0] || ''));
        }
      })
      .catch((error) => {
        console.error('Failed to load category rates:', error);
        setFareError('Vehicle rates are unavailable right now. Please try again later.');
      });
  }, []);

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
        setFareError('');
      }
    } catch (err) {
      console.error('Failed to calculate tariff:', err);
      setFareError(err.response?.data?.message || 'Unable to calculate an estimate right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cabType) return;
    calculateFare();
  }, [tripType, distanceKm, cabType]);

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
            Review the category rate and distance estimate; any applicable charges are stated in your confirmed quote.
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

              {/* Cab Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Cab Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(rates).map(([name, rate]) => (
                    <div
                      key={name}
                      role="button"
                      tabIndex={0}
                      onClick={() => setCabType(name)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') setCabType(name);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        cabType === name
                          ? 'bg-orange/10 border-orange text-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{name}</span>
                        <span className="text-xs text-orange font-mono font-bold">
                          ₹{rate.perKm}{rate.maxPerKm > rate.perKm ? `–₹${rate.maxPerKm}` : ''}/km
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {Object.keys(rates).length === 0 && (
                  <p className="text-xs text-slate-500">Vehicle rates are not available.</p>
                )}
              </div>
              {tripType.startsWith('outstation') && (
                <p className="rounded-xl bg-orange-50 p-3 text-xs leading-relaxed text-slate-700">
                  Outstation minimum billing distance: {minimumBillingDistance} km.
                </p>
              )}

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
                        <span>Estimated distance fare</span>
                        <span className="text-slate-900 font-medium">₹{fareResult.breakdown.distanceFare}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <div>
                        <span className="text-xs text-slate-500 block">Estimated distance fare</span>
                        <span className="text-[11px] text-slate-500 font-medium">Final amount is confirmed in your quote</span>
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
                    {fareResult.outstationPricing && (
                      <div className="space-y-2 rounded-xl bg-orange-50 p-3 text-xs leading-relaxed text-slate-700">
                        <p>{fareResult.outstationPricing.tollParkingInfo}</p>
                        <p>{fareResult.outstationPricing.driverAllowanceInfo}</p>
                        <p>{fareResult.outstationPricing.otherChargesInfo}</p>
                        <p>{fareResult.outstationPricing.paymentDueInfo}</p>
                      </div>
                    )}
                  </div>
                )}
                {fareError && <p className="mb-3 text-xs text-red-600" role="alert">{fareError}</p>}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default TariffCalculatorPage;
