import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Phone, Star, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const DriversView = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalDriver, setModalDriver] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    experienceYears: 5,
    rating: 4.8,
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  const fetchDrivers = async () => {
    try {
      const { data } = await api.get('/drivers');
      if (data.success) {
        setDrivers(data.drivers);
      }
    } catch (err) {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAdd = () => {
    setModalDriver(null);
    setForm({
      name: '',
      phone: '',
      licenseNumber: '',
      experienceYears: 5,
      rating: 4.8,
      status: 'available',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    });
    setShowModal(true);
  };

  const openEdit = (d) => {
    setModalDriver(d);
    setForm({
      name: d.name,
      phone: d.phone,
      licenseNumber: d.licenseNumber,
      experienceYears: d.experienceYears,
      rating: d.rating,
      status: d.status,
      avatar: d.avatar
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalDriver) {
        await api.put(`/drivers/${modalDriver._id}`, form);
        toast.success('Driver profile updated');
      } else {
        await api.post('/drivers', form);
        toast.success('Driver registered successfully');
      }
      setShowModal(false);
      fetchDrivers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save driver');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this driver profile?')) return;
    try {
      await api.delete(`/drivers/${id}`);
      toast.success('Driver deleted');
      fetchDrivers();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Chauffeurs & Drivers</h1>
          <p className="text-xs text-gray-400 mt-1">Verified drivers, contact numbers, licenses, and availability</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-shine px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-xs shadow-glow-orange flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((d) => (
          <div key={d._id} className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={d.avatar}
                  alt={d.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-orange flex-shrink-0"
                />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">{d.name}</h3>
                  <a href={`tel:${d.phone}`} className="text-xs text-orange font-semibold flex items-center gap-1 hover:underline">
                    <Phone className="w-3 h-3" />
                    {d.phone}
                  </a>
                  <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    d.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                    d.status === 'on_trip' ? 'bg-orange/20 text-orange' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300 py-3 border-y border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">License No</span>
                  <span className="font-mono text-white">{d.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-white">{d.experienceYears} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-orange font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {d.rating} / 5.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Trips</span>
                  <span className="text-white font-bold">{d.totalTrips || 0}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => openEdit(d)}
                className="p-2 rounded-xl glass hover:border-orange text-orange"
                title="Edit Driver"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(d._id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400"
                title="Delete Driver"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
          <div className="glass-card border border-white/20 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-xl text-white mb-4">
              {modalDriver ? 'Edit Chauffeur' : 'Register New Chauffeur'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Gowda"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98450 11223"
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Driving License Number *</label>
                <input
                  type="text"
                  required
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value.toUpperCase() })}
                  placeholder="KA0120150004123"
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Availability</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  >
                    <option value="available" className="bg-navy">available</option>
                    <option value="on_trip" className="bg-navy">on_trip</option>
                    <option value="off_duty" className="bg-navy">off_duty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl glass text-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold">
                  Save Chauffeur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversView;
