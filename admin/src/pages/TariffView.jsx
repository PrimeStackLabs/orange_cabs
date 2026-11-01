import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EMPTY_CATEGORY = {
  name: '',
  minRate: '',
  maxRate: '',
  image: '',
  passengers: ''
};

const DEFAULT_OUTSTATION_PRICING = {
  minimumBillingDistance: 300,
  tollParkingInfo: '',
  driverAllowanceInfo: '',
  otherChargesInfo: '',
  paymentDueInfo: ''
};

export default function TariffView() {
  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [outstationPricing, setOutstationPricing] = useState(DEFAULT_OUTSTATION_PRICING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.success) {
          setSettings(data.settings);
          setCategories(data.settings.vehicleCategories || []);
          setOutstationPricing({
            ...DEFAULT_OUTSTATION_PRICING,
            ...data.settings.outstationPricing,
            minimumBillingDistance: 300
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load vehicle pricing');
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const updateCategory = (index, field, value) => {
    setCategories((current) => current.map((category, categoryIndex) => (
      categoryIndex === index ? { ...category, [field]: value } : category
    )));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    const vehicleCategories = categories.map((category) => ({
      ...category,
      minRate: Number(category.minRate),
      maxRate: Number(category.maxRate),
      passengers: category.passengers === '' ? undefined : Number(category.passengers)
    }));

    try {
      const { data } = await api.put('/settings', {
        ...settings,
        vehicleCategories,
        outstationPricing: {
          ...outstationPricing,
          minimumBillingDistance: 300
        }
      });
      if (data.success) {
        setSettings(data.settings);
        setCategories(data.settings.vehicleCategories || vehicleCategories);
        toast.success('Vehicle and outstation pricing saved');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save pricing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-400">Loading vehicle pricing…</p>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-black text-white sm:text-3xl">Pricing &amp; Categories</h1>
          <p className="mt-1 text-xs text-gray-400">Manage the rates and images shown on the public website.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-glow disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save Pricing'}
        </button>
      </div>

      <section className="glass-card space-y-4 rounded-3xl border border-white/10 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Vehicle categories</h2>
            <p className="mt-1 text-xs text-gray-400">Rates are per kilometre. Use the same rate for both fields when there is no range.</p>
          </div>
          <button
            type="button"
            onClick={() => setCategories((current) => [...current, { ...EMPTY_CATEGORY }])}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-orange/40 px-3 py-2 text-xs font-semibold text-orange hover:bg-orange/10"
          >
            <Plus className="h-4 w-4" />
            Add category
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={`${category.name}-${index}`} className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 xl:grid-cols-6">
              <label className="text-xs text-gray-300 xl:col-span-1">
                Category
                <input
                  required
                  value={category.name}
                  onChange={(event) => updateCategory(index, 'name', event.target.value)}
                  className="glass-input mt-1 w-full px-3 py-2"
                />
              </label>
              <label className="text-xs text-gray-300">
                From (₹/km)
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={category.minRate}
                  onChange={(event) => updateCategory(index, 'minRate', event.target.value)}
                  className="glass-input mt-1 w-full px-3 py-2"
                />
              </label>
              <label className="text-xs text-gray-300">
                To (₹/km)
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={category.maxRate}
                  onChange={(event) => updateCategory(index, 'maxRate', event.target.value)}
                  className="glass-input mt-1 w-full px-3 py-2"
                />
              </label>
              <label className="text-xs text-gray-300">
                Passengers
                <input
                  type="number"
                  min="1"
                  value={category.passengers || ''}
                  onChange={(event) => updateCategory(index, 'passengers', event.target.value)}
                  className="glass-input mt-1 w-full px-3 py-2"
                />
              </label>
              <label className="text-xs text-gray-300 sm:col-span-2">
                Vehicle image URL
                <input
                  required
                  value={category.image}
                  onChange={(event) => updateCategory(index, 'image', event.target.value)}
                  className="glass-input mt-1 w-full px-3 py-2"
                />
              </label>
              <div className="flex items-end justify-end xl:col-span-6">
                <button
                  type="button"
                  onClick={() => setCategories((current) => current.filter((_, categoryIndex) => categoryIndex !== index))}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                  aria-label={`Remove ${category.name || 'vehicle category'}`}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove category
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="rounded-xl border border-dashed border-white/15 p-5 text-center text-xs text-gray-400">
              No vehicle categories yet. Add one to manage public pricing.
            </p>
          )}
        </div>
      </section>

      <section className="glass-card space-y-4 rounded-3xl border border-white/10 p-5 sm:p-7">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">Outstation pricing information</h2>
          <p className="mt-1 text-xs text-gray-400">The 300 km minimum is fixed. Keep all other terms aligned with the confirmed quote.</p>
        </div>

        <label className="block text-xs text-gray-300">
          Minimum billing distance
          <div className="glass-input mt-1 flex items-center justify-between px-3 py-2 text-sm text-gray-300">
            300 km
            <span className="text-[10px] uppercase tracking-wide text-orange">Fixed</span>
          </div>
        </label>

        {[
          ['tollParkingInfo', 'Toll and parking charges'],
          ['driverAllowanceInfo', 'Driver allowance'],
          ['otherChargesInfo', 'Other applicable charges'],
          ['paymentDueInfo', 'Final payment due']
        ].map(([field, label]) => (
          <label key={field} className="block text-xs text-gray-300">
            {label}
            <textarea
              required
              rows="2"
              value={outstationPricing[field]}
              onChange={(event) => setOutstationPricing((current) => ({ ...current, [field]: event.target.value }))}
              className="glass-input mt-1 w-full resize-y px-3 py-2"
            />
          </label>
        ))}
      </section>
    </form>
  );
}
