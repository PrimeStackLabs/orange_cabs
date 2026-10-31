import React, { useState, useEffect } from 'react';
import { DollarSign, Save, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TariffView = () => {
  const [settings, setSettings] = useState({
    gstPercentage: 5,
    baseNightCharges: 300,
    driverAllowancePerDay: 400,
    tollTaxesEstimated: 250
  });
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const [sRes, rRes] = await Promise.all([
          api.get('/settings'),
          api.get('/fares/rates')
        ]);
        if (sRes.data.success) setSettings(sRes.data.settings);
        if (rRes.data.success) setRates(rRes.data.rates);
      } catch (err) {
        toast.error('Failed to load tariffs');
      } finally {
        setLoading(false);
      }
    };
    fetchTariffs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/settings', settings);
      if (data.success) {
        toast.success('Tariff & Tax settings saved');
      }
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Pricing & Tariff Engine</h1>
        <p className="text-xs text-gray-400 mt-1">Configure global per-km calculation rules, driver daily allowances, toll estimates, and GST rates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Rules Form */}
        <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white mb-2">Government & Regulatory Tariffs</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">State GST Rate (%)</label>
            <input
              type="number"
              value={settings.gstPercentage}
              onChange={(e) => setSettings({ ...settings, gstPercentage: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Driver Daily Allowance (₹/Day)</label>
            <input
              type="number"
              value={settings.driverAllowancePerDay}
              onChange={(e) => setSettings({ ...settings, driverAllowancePerDay: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Estimated Highway Toll (₹/Trip)</label>
            <input
              type="number"
              value={settings.tollTaxesEstimated}
              onChange={(e) => setSettings({ ...settings, tollTaxesEstimated: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Night Driving Charges (₹/Night 10PM-6AM)</label>
            <input
              type="number"
              value={settings.baseNightCharges}
              onChange={(e) => setSettings({ ...settings, baseNightCharges: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-shine w-full mt-4 py-3 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-xs shadow-glow-orange flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Global Tariff Policies</span>
          </button>
        </form>

        {/* Current Vehicle Base Matrix */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-lg text-white mb-2">Category Rate Breakdown</h3>
          <p className="text-xs text-gray-400">Current baseline rates used by live calculator:</p>

          <div className="space-y-3 pt-2">
            {Object.entries(rates).map(([cat, val]) => (
              <div key={cat} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-white text-sm block">{cat}</span>
                  <span className="text-[11px] text-gray-400">{val.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-heading font-black text-orange text-base block">₹{val.perKm}/km</span>
                  <span className="text-[10px] text-gray-400">Base ₹{val.baseFare} ({val.baseKm}km)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffView;
