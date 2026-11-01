import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car, 
  ArrowRight, 
  Plane, 
  Compass, 
  Sparkles,
  Building2,
  Repeat
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const DEFAULT_VEHICLE_CATEGORIES = ['Hatchback', 'Sedan', 'SUV', 'Luxury Cars', 'Tempo Traveller'];

export default function BookingWidget({ className = '' }) {
  const { openBookingModal } = useBookingModal();

  const [activeTab, setActiveTab] = useState('outstation');
  const [formData, setFormData] = useState({
    pickup: 'Bangalore City',
    drop: 'Mysore',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    cabType: 'SUV',
    passengers: 2
  });
  const [vehicleCategories, setVehicleCategories] = useState(DEFAULT_VEHICLE_CATEGORIES);

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => {
        if (data.success && data.settings.vehicleCategories?.length) {
          setVehicleCategories(data.settings.vehicleCategories.map(({ name }) => name));
        }
      })
      .catch((error) => {
        console.error('Failed to load booking vehicle categories:', error);
        toast.error('Vehicle categories could not be loaded.');
      });
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'airport') {
      setFormData(prev => ({
        ...prev,
        pickup: 'Bangalore City',
        drop: 'Kempegowda Int. Airport (BLR)'
      }));
    } else if (tab === 'local') {
      setFormData(prev => ({
        ...prev,
        pickup: 'Bangalore City',
        drop: 'Local City Rental (8h / 80km)'
      }));
    } else if (tab === 'corporate') {
      setFormData(prev => ({
        ...prev,
        pickup: 'Electronic City / Whitefield',
        drop: 'Corporate Campus Shuttle'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        pickup: 'Bangalore City',
        drop: 'Mysore'
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    openBookingModal({
      pickup: formData.pickup,
      drop: formData.drop,
      date: formData.date,
      time: formData.time,
      cabType: formData.cabType,
      passengers: Number(formData.passengers) || 1,
      serviceType: activeTab === 'airport' ? 'Airport Pickup & Drop' : activeTab === 'local' ? 'Local Travel' : activeTab === 'corporate' ? 'Corporate Travel' : 'Outstation Travel'
    });
  };

  return (
    <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100 ${className}`}>
      
      {/* Service Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-gray-100 mb-5">
        <button
          type="button"
          onClick={() => handleTabChange('outstation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'outstation'
              ? 'bg-brandRed text-white shadow-md'
              : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <Compass className="w-4 h-4 text-accentOrange" />
          <span>Outstation Cabs</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('airport')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'airport'
              ? 'bg-brandRed text-white shadow-md'
              : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <Plane className="w-4 h-4 text-brandRed" />
          <span>Airport Transfers</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('local')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'local'
              ? 'bg-brandRed text-white shadow-md'
              : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4 text-accentOrange" />
          <span>Local Hourly</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('corporate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'corporate'
              ? 'bg-brandRed text-white shadow-md'
              : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-brandRed" />
          <span>Corporate Travel</span>
        </button>
      </div>

      {/* Main Booking Form Fields */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 items-end">
          
          {/* Pickup Location */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accentOrange" />
              Pickup Location
            </label>
            <input
              type="text"
              name="pickup"
              value={formData.pickup}
              onChange={handleChange}
              placeholder="e.g. Bangalore Airport, MG Road..."
              className="w-full px-3.5 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs sm:text-sm text-charcoal font-medium focus:bg-white focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
              required
            />
          </div>

          {/* Drop Location */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brandRed" />
              Drop Location
            </label>
            <input
              type="text"
              name="drop"
              value={formData.drop}
              onChange={handleChange}
              placeholder="e.g. Mysore, Coorg, Ooty, Chennai..."
              className="w-full px-3.5 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs sm:text-sm text-charcoal font-medium focus:bg-white focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
              required
            />
          </div>

          {/* Travel Date */}
          <div className="lg:col-span-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Travel Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs text-charcoal font-medium focus:bg-white focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
              required
            />
          </div>

          {/* Pickup Time */}
          <div className="lg:col-span-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Pickup Time
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="09:00 AM"
              className="w-full px-3 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs text-charcoal font-medium focus:bg-white focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
            />
          </div>
        </div>

        {/* Second Row: Vehicle Category, Passengers & Book Now CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 mt-3.5 items-end">
          
          {/* Vehicle Category */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-accentOrange" />
              Vehicle Category
            </label>
            <select
              name="cabType"
              value={formData.cabType}
              onChange={handleChange}
              className="w-full px-3.5 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs sm:text-sm text-charcoal font-medium focus:bg-white focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
            >
              {vehicleCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Number of Passengers */}
          <div className="lg:col-span-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              Passengers
            </label>
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className="w-full px-3 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs sm:text-sm text-charcoal font-medium focus:bg-white focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
            >
              {[1, 2, 3, 4, 5, 6, 7, 10, 13, 16, 26].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          {/* Book Now Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full btn-primary !py-3.5 !px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-glow-red"
            >
              <span>Book Your Ride Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
