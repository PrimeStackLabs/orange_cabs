import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Calendar, ArrowRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const RoutesPackagesView = () => {
  const [routes, setRoutes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [tab, setTab] = useState('routes'); // 'routes' or 'packages'
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [rRes, pRes] = await Promise.all([
        api.get('/routes'),
        api.get('/packages')
      ]);
      if (rRes.data.success) setRoutes(rRes.data.routes);
      if (pRes.data.success) setPackages(pRes.data.packages);
    } catch (err) {
      toast.error('Failed to load routes/packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Delete route?')) return;
    try {
      await api.delete(`/routes/${id}`);
      toast.success('Route removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete route');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Delete package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      toast.success('Package removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete package');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Routes & Holiday Packages</h1>
          <p className="text-xs text-gray-400 mt-1">Manage popular fixed rate routes and multi-day vacation packages</p>
        </div>

        <div className="flex rounded-xl glass p-1 border border-white/10">
          <button
            onClick={() => setTab('routes')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
              tab === 'routes' ? 'bg-orange text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Intercity Routes ({routes.length})
          </button>
          <button
            onClick={() => setTab('packages')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
              tab === 'packages' ? 'bg-orange text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Tour Packages ({packages.length})
          </button>
        </div>
      </div>

      {tab === 'routes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((r) => (
            <div key={r._id} className="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="h-32 rounded-2xl overflow-hidden mb-3 relative">
                  <img src={r.image} alt={r.toCity} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-navy/80 px-2.5 py-0.5 rounded text-[11px] text-white">
                    {r.estimatedDuration} • {r.distanceKm} km
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-1.5">
                  <span>{r.fromCity}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-orange" />
                  <span>{r.toCity}</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">{r.tagline}</p>
                <div className="mt-3 text-xs text-gray-300">
                  <span>Sedan: <strong className="text-orange">₹{r.prices?.Sedan}</strong></span>
                  <span className="mx-2">•</span>
                  <span>SUV: <strong className="text-white">₹{r.prices?.SUV}</strong></span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/5 mt-3">
                <button
                  onClick={() => handleDeleteRoute(r._id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                  title="Delete Route"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((p) => (
            <div key={p._id} className="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="h-32 rounded-2xl overflow-hidden mb-3 relative">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-orange px-2.5 py-0.5 rounded text-[11px] font-bold text-white">
                    {p.durationDays}D / {p.durationNights}N
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-white">{p.title}</h3>
                <span className="text-[11px] text-gray-400 block mt-1">Starting from {p.startCity}</span>
                <span className="font-heading font-black text-xl text-orange block mt-2">
                  ₹{p.startingPrice?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/5 mt-3">
                <button
                  onClick={() => handleDeletePackage(p._id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutesPackagesView;
