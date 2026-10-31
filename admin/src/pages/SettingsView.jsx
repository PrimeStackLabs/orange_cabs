import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, Globe, Phone, MessageSquare, Mail, MapPin, Sparkles } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    brandName: 'Orange Cab',
    tagline: 'Premium Intercity & Airport Mobility Solutions',
    logoUrl: '',
    phone: '+91 99999 99999',
    whatsapp: '919999999999',
    email: 'info@orangecab.in',
    address: 'Ground Floor, Prestige Meridian, MG Road, Bangalore 560001, Karnataka, India',
    workingHours: '24 Hours / 7 Days a Week',
    socialLinks: {
      facebook: 'https://facebook.com/orangecab',
      instagram: 'https://instagram.com/orangecab',
      twitter: 'https://x.com/orangecab',
      youtube: 'https://youtube.com/@orangecab',
      linkedin: 'https://linkedin.com/company/orangecab',
      whatsapp: 'https://wa.me/919999999999',
      telegram: 'https://t.me/orangecab',
      pinterest: 'https://pinterest.com/orangecab'
    },
    seo: {
      metaTitle: 'Orange Cab | Premium Intercity & Airport Mobility Solutions',
      metaDescription: 'Book luxury, certified chauffeur-driven cabs with 100% verified drivers, transparent billing, and premium fleet.',
      keywords: 'cab booking, airport taxi, outstation cabs bangalore, luxury transport'
    },
    chatbotQuickReplies: [
      'Book a cab now',
      'Check per-km rates',
      'Airport transfer BLR',
      'Corporate ETS inquiry',
      'Talk to human agent'
    ]
  });

  const [saving, setSaving] = useState(false);
  const [quickRepliesText, setQuickRepliesText] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/content/settings');
        if (data.success && data.settings) {
          setSettings(data.settings);
          if (data.settings.chatbotQuickReplies) {
            setQuickRepliesText(data.settings.chatbotQuickReplies.join(', '));
          }
        }
      } catch (err) {
        toast.error('Failed to load settings');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...settings,
        chatbotQuickReplies: quickRepliesText.split(',').map(s => s.trim()).filter(Boolean)
      };
      const { data } = await api.put('/content/settings', payload);
      if (data.success) {
        toast.success('Website configuration saved successfully');
      }
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Website Settings</h1>
          <p className="text-xs text-gray-400 mt-1">Configure global contact numbers, SEO meta tags, social profiles, and chatbot replies</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Core Brand & Contacts */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange" />
            General Brand & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName || ''}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Primary Helpline Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">WhatsApp Number (e.g. 919999999999)</label>
              <input
                type="text"
                value={settings.whatsapp || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Official Support Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-gray-300 font-semibold mb-1">Registered Headquarters Address</label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
            />
          </div>
        </div>

        {/* SEO Meta Tags */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange" />
            Search Engine Optimization (SEO)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Meta Title Tag</label>
              <input
                type="text"
                value={settings.seo?.metaTitle || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  seo: { ...settings.seo, metaTitle: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Meta Description Tag</label>
              <textarea
                rows="2"
                value={settings.seo?.metaDescription || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  seo: { ...settings.seo, metaDescription: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Chatbot Quick Replies */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange" />
            Chatbot Quick Reply Chips
          </h3>
          <div className="text-xs">
            <label className="block text-gray-300 font-semibold mb-1">Quick Replies (comma-separated chips)</label>
            <input
              type="text"
              value={quickRepliesText}
              onChange={(e) => setQuickRepliesText(e.target.value)}
              placeholder="Book a cab now, Check per-km rates, Airport transfer, Talk to agent"
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-base text-white">Social Media Profile URLs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'whatsapp', 'telegram', 'pinterest'].map((key) => (
              <div key={key}>
                <label className="block text-gray-300 font-semibold mb-1 capitalize">{key}</label>
                <input
                  type="url"
                  value={settings.socialLinks?.[key] || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, [key]: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-orange to-orange-glow text-white font-bold text-xs shadow-glow-orange flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>

      </form>
    </div>
  );
}
