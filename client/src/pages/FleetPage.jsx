import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Luggage, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  X,
  Phone,
  CheckCircle2,
  Car,
  CarFront,
  Clock3,
  Wind,
  Fuel,
  Info,
  PlayCircle,
  Tag
} from 'lucide-react';
import api from '../services/api';
import { useBookingModal } from '../context/BookingModalContext';
import { VEHICLE_IMAGES, VEHICLE_IMAGE_FALLBACK } from '../constants/vehicleImages';
import toast from 'react-hot-toast';

const FILTER_TABS = [
  'All Vehicles',
  'Hatchbacks',
  'Sedans',
  'Toyota Innova',
  'SUVs',
  'Tempo & Coaches'
];

const getFleetImage = (vehicle) => {
  const model = `${vehicle.name || ''} ${vehicle.category || ''}`.toLowerCase();
  if (model.includes('hycross')) return VEHICLE_IMAGES.hycross;
  if (model.includes('crysta')) return VEHICLE_IMAGES.crysta;
  if (model.includes('ertiga')) return VEHICLE_IMAGES.ertiga;
  if (model.includes('mercedes')) return VEHICLE_IMAGES.mercedesEClass;
  if (model.includes('dzire') || model.includes('sedan')) {
    return VEHICLE_IMAGES.dzire;
  }
  if (model.includes('urbania')) return VEHICLE_IMAGES.urbania;
  if (model.includes('bharatbenz') || model.includes('bus') || model.includes('coach')) return VEHICLE_IMAGES.bharatbenzCoach;
  if (model.includes('wagonr') || model.includes('swift') || model.includes('hatchback')) return VEHICLE_IMAGES.dzire;
  return '';
};

const resolveFleetImage = (vehicle) => {
  const selectedPhoto = getFleetImage(vehicle);
  const configuredImage = typeof vehicle.image === 'string' ? vehicle.image.trim() : '';
  const isPreviousHatchbackPhoto = configuredImage.includes('/images/gallery_2.jpeg');

  // Keep admin-uploaded images; replace generic seeded stock photos with model-specific fleet photography.
  if (configuredImage && !configuredImage.includes('images.unsplash.com') && !isPreviousHatchbackPhoto) return configuredImage;
  return selectedPhoto || configuredImage || VEHICLE_IMAGE_FALLBACK;
};

const DEFAULT_FLEET = [
  {
    id: 'f-1',
    name: 'Maruti Suzuki WagonR',
    category: 'Hatchbacks',
    model: 'Hatchback',
    image: VEHICLE_IMAGES.dzire,
    seatingCapacity: 4,
    luggageCapacity: 2,
    fuelType: 'CNG / Petrol',
    ac: true,
    features: ['Air-conditioned cabin', 'Verified chauffeur', 'City-friendly comfort'],
    description: 'A practical, comfortable choice for everyday city rides and quick airport transfers.'
  },
  {
    id: 'f-2',
    name: 'Maruti Suzuki Swift',
    category: 'Hatchbacks',
    model: 'Hatchback',
    image: VEHICLE_IMAGES.dzire,
    seatingCapacity: 4,
    luggageCapacity: 2,
    fuelType: 'Petrol',
    ac: true,
    features: ['Compact and comfortable', 'Air-conditioned cabin', 'Professional chauffeur'],
    description: 'A nimble hatchback for comfortable city commutes and point-to-point travel.'
  },
  {
    id: 'f-3',
    name: 'Maruti Suzuki Dzire',
    category: 'Sedans',
    model: 'Sedan',
    image: VEHICLE_IMAGES.dzire,
    seatingCapacity: 4,
    luggageCapacity: 2,
    fuelType: 'CNG / Petrol',
    ac: true,
    features: ['Comfortable seating', 'Air-conditioned cabin', 'Transparent fares'],
    description: 'A dependable sedan for airport transfers, business travel, and outstation journeys.'
  },
  {
    id: 'f-4',
    name: 'Maruti Suzuki Ertiga',
    category: 'SUVs',
    model: 'MPV',
    image: VEHICLE_IMAGES.ertiga,
    seatingCapacity: 6,
    luggageCapacity: 4,
    fuelType: 'CNG / Petrol',
    ac: true,
    features: ['Flexible seating', 'Spacious luggage area', 'Rear AC vents'],
    description: 'A versatile family MPV with space for passengers and luggage on longer journeys.'
  },
  {
    id: 'f-5',
    name: 'Toyota Innova Crysta',
    category: 'Toyota Innova',
    model: 'Toyota Innova Crysta',
    image: VEHICLE_IMAGES.crysta,
    seatingCapacity: 7,
    luggageCapacity: 4,
    fuelType: 'Diesel',
    ac: true,
    features: ['Comfortable captain seats', 'Rear AC', 'Spacious luggage area'],
    description: 'A spacious, well-appointed MPV for family outstation trips and executive travel.'
  },
  {
    id: 'f-6',
    name: 'Toyota Innova Hycross',
    category: 'Toyota Innova',
    model: 'Toyota Innova Hycross',
    image: VEHICLE_IMAGES.hycross,
    seatingCapacity: 7,
    luggageCapacity: 4,
    fuelType: 'Petrol Hybrid',
    ac: true,
    features: ['Comfortable three-row seating', 'Air-conditioned cabin', 'Ample luggage space'],
    description: 'A modern, roomy MPV suited to comfortable family, airport, and business journeys.'
  },
  {
    id: 'f-7',
    name: 'Mercedes-Benz E-Class',
    category: 'Sedans',
    model: 'Executive Sedan',
    image: VEHICLE_IMAGES.mercedesEClass,
    seatingCapacity: 4,
    luggageCapacity: 3,
    fuelType: 'Diesel',
    ac: true,
    features: ['Executive cabin', 'Automatic climate control', 'Chauffeur-driven comfort'],
    description: 'A premium executive sedan for business travel and special occasions.'
  },
  {
    id: 'f-8',
    name: 'Force Urbania',
    category: 'Tempo & Coaches',
    model: 'Tempo & Coach',
    image: VEHICLE_IMAGES.urbania,
    seatingCapacity: 13,
    luggageCapacity: 12,
    fuelType: 'Diesel',
    ac: true,
    features: ['Individual air vents', 'High-roof cabin', 'Group-friendly seating'],
    description: 'Comfortable group transportation with generous headroom and space for luggage.'
  },
  {
    id: 'f-9',
    name: 'BharatBenz AC Tourist Coach',
    category: 'Tempo & Coaches',
    model: 'Tempo & Coach',
    image: VEHICLE_IMAGES.bharatbenzCoach,
    seatingCapacity: 26,
    luggageCapacity: 25,
    fuelType: 'Diesel',
    ac: true,
    features: ['Air-conditioned cabin', 'Pushback passenger seats', 'Overhead luggage racks'],
    description: 'A well-equipped coach for corporate outings, events, and larger group journeys.'
  }
];

export default function FleetPage() {
  const { openBookingModal } = useBookingModal();
  const [activeTab, setActiveTab] = useState('All Vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fleet, setFleet] = useState(DEFAULT_FLEET);
  const [categoryRates, setCategoryRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.allSettled([api.get('/vehicles?status=available'), api.get('/settings')])
      .then(([vehiclesResult, settingsResult]) => {
        if (!active) return;

        if (vehiclesResult.status === 'fulfilled' && vehiclesResult.value.data.success) {
          setFleet((vehiclesResult.value.data.vehicles || []).map((vehicle) => {
            const rawCategory = vehicle.category || '';
            const normalizedCategory = rawCategory.toLowerCase();
            const filterCategory = normalizedCategory.includes('hatch')
              || normalizedCategory.includes('wagon')
              || normalizedCategory.includes('swift')
              ? 'Hatchbacks'
              : normalizedCategory.includes('sedan')
                ? 'Sedans'
                : normalizedCategory.includes('innova')
                  ? 'Toyota Innova'
                  : normalizedCategory.includes('suv') || normalizedCategory.includes('ertiga') || normalizedCategory.includes('mpv')
                    ? 'SUVs'
                    : normalizedCategory.includes('luxury')
                      ? 'Sedans'
                      : normalizedCategory.includes('tempo') || normalizedCategory.includes('bus') || normalizedCategory.includes('coach') || normalizedCategory.includes('traveller')
                        ? 'Tempo & Coaches'
                        : rawCategory;

            return {
              id: vehicle._id,
              name: vehicle.name,
              category: filterCategory,
              model: rawCategory,
              image: resolveFleetImage(vehicle),
              seatingCapacity: vehicle.seatingCapacity,
              luggageCapacity: vehicle.luggageCapacity,
              fuelType: vehicle.fuelType,
              ac: vehicle.ac,
              features: vehicle.features || [],
              description: `${rawCategory} vehicle available for booking.`
            };
          }));
        } else {
          const error = vehiclesResult.status === 'rejected' ? vehiclesResult.reason : null;
          console.error('Failed to load public fleet:', error);
          toast.error('The fleet list could not be refreshed.');
        }

        if (settingsResult.status === 'fulfilled' && settingsResult.value.data.success) {
          setCategoryRates(settingsResult.value.data.settings.vehicleCategories || []);
        } else {
          const error = settingsResult.status === 'rejected' ? settingsResult.reason : null;
          console.error('Failed to load public vehicle rates:', error);
          toast.error('Vehicle rates could not be loaded.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredFleet = activeTab === 'All Vehicles'
    ? fleet
    : fleet.filter((vehicle) => vehicle.category === activeTab);

  const getCategoryRate = (vehicle) => {
    const descriptor = `${vehicle.category} ${vehicle.model} ${vehicle.name}`.toLowerCase();
    const categoryName = descriptor.includes('tempo') || descriptor.includes('coach') || descriptor.includes('bus')
      ? 'Tempo Traveller'
      : descriptor.includes('luxury') || descriptor.includes('mercedes') || descriptor.includes('bmw')
        ? 'Luxury Cars'
        : descriptor.includes('innova') || descriptor.includes('suv') || descriptor.includes('fortuner')
          ? 'SUV'
          : descriptor.includes('hatchback') || descriptor.includes('wagon') || descriptor.includes('swift')
            ? 'Hatchback'
            : 'Sedan';
    return categoryRates.find(({ name }) => name.toLowerCase() === categoryName.toLowerCase());
  };

  const formatCategoryRate = (vehicle) => {
    const rate = getCategoryRate(vehicle);
    if (!rate) return 'Rate on request';
    return `₹${rate.minRate}${rate.maxRate > rate.minRate ? `–₹${rate.maxRate}` : ''} / km`;
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Page Header */}
      <section className="fleet-page-hero relative overflow-hidden">
        <motion.div
          className="relative z-10 mx-auto grid min-h-[460px] max-w-[1580px] grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:min-h-[570px] lg:grid-cols-[0.94fr_1.06fr] lg:gap-10 lg:px-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FFE0A6] bg-[#FFF3D6] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#D94308] sm:text-xs">
              <CarFront className="h-4 w-4" />
              Automotive Excellence
            </span>
            <h1 className="mt-5 max-w-[720px] font-heading text-4xl font-black leading-[1.02] tracking-tight text-[#171717] sm:text-5xl lg:text-[60px]">
              Our Luxury <span className="fleet-page-hero__highlight">Fleet</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#4c5b73] sm:text-base sm:leading-7">
              Find a vehicle that fits your journey, from comfortable city sedans to spacious group travel.
            </p>
            <div className="fleet-page-hero__trust mt-6 grid max-w-xl grid-cols-2 sm:grid-cols-4">
              {[
                { label: <>Safe &amp;<br />Reliable</>, Icon: ShieldCheck },
                { label: <>Spacious &amp;<br />Comfortable</>, Icon: Users },
                { label: <>On-Time<br />Service</>, Icon: Clock3 },
                { label: <>Transparent<br />Pricing</>, Icon: Tag },
              ].map(({ label, Icon }, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5 px-1 py-2 text-center sm:border-l sm:border-gray-300 sm:first:border-0 sm:px-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0DD] text-[#F45B0B] sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="text-[10px] font-bold leading-tight text-[#171717] sm:text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openBookingModal}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <CarFront className="h-5 w-5" />
                Book Your Ride <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#fleet-vehicles"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F45B0B] px-6 py-3 text-sm font-semibold text-[#171717] transition duration-200 hover:bg-orange-50 hover:text-[#D94308]"
              >
                <PlayCircle className="h-5 w-5 text-[#F45B0B]" /> Explore Our Fleet
              </a>
            </div>
          </div>
          <div className="fleet-page-hero__visual relative mx-auto h-[260px] w-full max-w-[820px] sm:h-[360px] lg:h-[460px]">
            <div className="fleet-page-hero__accent" />
            <div className="fleet-page-hero__photo-frame">
              <img
                src="/images/fleet/innova-crysta-zx.webp"
                alt="Toyota Innova Crysta from the Orange Cars fleet"
                className="fleet-page-hero__image"
              />
            </div>
            <div className="fleet-page-hero__caption">
              <Users className="h-4 w-4 shrink-0 text-[#F45B0B]" />
              <span>Comfort for every passenger</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-brandRed text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Cards Grid */}
      <section id="fleet-vehicles" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="fleet-vehicle-card group"
              >
                {/* Vehicle Image */}
                <div className="fleet-vehicle-card__media">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="fleet-vehicle-card__image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = VEHICLE_IMAGE_FALLBACK;
                    }}
                  />
                  <span className="fleet-vehicle-card__category">
                    {vehicle.category}
                  </span>
                  <span className="fleet-vehicle-card__rate">
                    {formatCategoryRate(vehicle)}
                  </span>
                </div>

                {/* Card Details */}
                <div className="fleet-vehicle-card__body">
                  <div>
                    <h3 className="fleet-vehicle-card__title">
                      {vehicle.name}
                    </h3>
                    
                    <p className="fleet-vehicle-card__description">
                      {vehicle.description}
                    </p>

                    {/* Quick Specs */}
                    <div className="fleet-vehicle-card__specs">
                      <div className="fleet-vehicle-card__spec">
                        <Users aria-hidden="true" />
                        <span>{vehicle.seatingCapacity} Seats</span>
                      </div>
                      <div className="fleet-vehicle-card__spec">
                        <Luggage aria-hidden="true" />
                        <span>{vehicle.luggageCapacity} Bags</span>
                      </div>
                      <div className="fleet-vehicle-card__spec">
                        <Wind aria-hidden="true" />
                        <span>{vehicle.ac ? 'AC' : 'Non-AC'}</span>
                      </div>
                    </div>

                    {/* Features preview */}
                    <div className="fleet-vehicle-card__features">
                      {vehicle.features.slice(0, 2).map((feat, fidx) => (
                        <span key={fidx} className="fleet-vehicle-card__feature">
                          <Check aria-hidden="true" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="fleet-vehicle-card__actions">
                    <div className="fleet-vehicle-card__starting-price">
                      <span>Per-kilometre rate</span>
                      <strong>{formatCategoryRate(vehicle)}</strong>
                    </div>

                    <div className="fleet-vehicle-card__buttons">
                      <button
                        type="button"
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="fleet-vehicle-card__info"
                        title="View Full Specifications"
                        aria-label={`View full specifications for ${vehicle.name}`}
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openBookingModal({
                          cabType: getCategoryRate(vehicle)?.name || vehicle.model,
                          category: getCategoryRate(vehicle)?.name || vehicle.model
                        })}
                        className="fleet-vehicle-card__book"
                      >
                        <span>Book This Ride</span>
                        <ArrowRight className="fleet-vehicle-card__arrow" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Vehicle Details Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100"
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="badge-pill-red">{selectedVehicle.model}</span>
                  <h3 className="font-heading font-black text-2xl text-charcoal mt-2">
                    {selectedVehicle.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {selectedVehicle.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 block">Capacity</span>
                    <strong className="text-charcoal font-semibold">{selectedVehicle.seatingCapacity} Passengers</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Luggage</span>
                    <strong className="text-charcoal font-semibold">{selectedVehicle.luggageCapacity} Bags</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Fuel Engine</span>
                    <strong className="text-charcoal font-semibold">{selectedVehicle.fuelType}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Per Km Rate</span>
                    <strong className="text-brandRed font-semibold">{formatCategoryRate(selectedVehicle)}</strong>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Amenities &amp; Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    {selectedVehicle.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Per-kilometre rate</span>
                    <strong className="text-base font-bold text-charcoal">{formatCategoryRate(selectedVehicle)}</strong>
                  </div>

                  <button
                    onClick={() => {
                      const veh = selectedVehicle;
                      setSelectedVehicle(null);
                      const category = getCategoryRate(veh)?.name || veh.model;
                      openBookingModal({ cabType: category, category });
                    }}
                    className="btn-primary text-xs sm:text-sm !py-2.5 !px-6"
                  >
                    <span>Book This Vehicle</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
