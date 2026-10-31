import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  CheckCircle2, 
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    image: '',
    description: '',
    badge: 'Popular',
    features: ''
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/services');
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        slug: service.slug,
        image: service.image,
        description: service.description,
        badge: service.badge || 'Popular',
        features: Array.isArray(service.features) ? service.features.join(', ') : ''
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        slug: '',
        image: '',
        description: '',
        badge: 'Popular',
        features: ''
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      features: formData.features.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await api.post('/services', payload);
        toast.success('New service created');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service removed');
      fetchServices();
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-white">Services Manager</h1>
          <p className="text-xs text-gray-400 mt-1">Manage public website service cards, descriptions, and feature lists</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange to-orange-glow text-white text-xs font-bold shadow-glow-orange flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl glass animate-pulse border border-white/5" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-gray-400">
          No services created yet. Click "Add New Service" above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <div
              key={svc._id}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group"
            >
              <div>
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {svc.badge && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-orange text-white text-[10px] font-bold shadow-glow-orange">
                      {svc.badge}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-heading font-bold text-base text-white mb-1.5">{svc.title}</h3>
                  <p className="text-xs text-gray-300 line-clamp-3 mb-3 leading-relaxed">{svc.description}</p>
                  
                  <div className="space-y-1">
                    {(svc.features || []).slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <CheckCircle2 className="w-3 h-3 text-orange shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400">slug: {svc.slug}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(svc)}
                    className="p-1.5 rounded-lg glass text-gray-300 hover:text-orange"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc._id)}
                    className="p-1.5 rounded-lg glass text-gray-300 hover:text-red-400"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-surface border border-white/15 rounded-3xl p-6 sm:p-8 shadow-glass text-softWhite">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-xl text-white mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Airport Transfers"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. airport-transfers"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detailed description of this mobility service..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Features (comma-separated)</label>
                <input
                  type="text"
                  placeholder="AC Cab, Police Verified, Uniformed Chauffeur, Real-Time GPS"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-orange text-white text-xs font-bold shadow-glow-orange hover:bg-orange-glow transition-all"
                >
                  Save Service
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-3 px-5 rounded-xl glass text-xs text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
