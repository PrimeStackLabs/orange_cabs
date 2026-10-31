import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Calendar, Check, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CouponsView = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'fixed',
    discountValue: 250,
    minTripFare: 1500,
    maxDiscount: 250,
    validUntil: '2028-12-31',
    description: ''
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      toast.error('Failed to load coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/coupons', form);
      if (data.success) {
        toast.success(`Coupon ${data.coupon.code} created`);
        setShowModal(false);
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Coupons & Promo Codes</h1>
          <p className="text-xs text-gray-400 mt-1">Configure promotional discount vouchers and seasonal campaigns</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-shine px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-xs shadow-glow-orange flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-lg text-orange px-3 py-1 rounded-xl bg-orange/15 border border-orange/40">
                  {c.code}
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-4">{c.description || 'Valid on all outstation cab bookings'}</p>
              <div className="text-[11px] text-gray-400 space-y-1">
                <div>Min Fare: <strong className="text-white">₹{c.minTripFare}</strong></div>
                <div>Valid Until: <strong className="text-white">{new Date(c.validUntil).toLocaleDateString()}</strong></div>
                <div>Usage Count: <strong className="text-orange">{c.usageCount}</strong> times</div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5 mt-4">
              <button
                onClick={() => handleDelete(c._id)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
          <div className="glass-card border border-white/20 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-xl text-white mb-4">Create Promo Code</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON300"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  >
                    <option value="fixed" className="bg-navy">Fixed (₹)</option>
                    <option value="percentage" className="bg-navy">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Min Trip Fare (₹)</label>
                  <input
                    type="number"
                    value={form.minTripFare}
                    onChange={(e) => setForm({ ...form, minTripFare: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Max Cap Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Special monsoon discount"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl glass text-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold">
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsView;
