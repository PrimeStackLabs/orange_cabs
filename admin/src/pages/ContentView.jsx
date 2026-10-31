import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit2, 
  Star, 
  HelpCircle, 
  Image, 
  CheckCircle2, 
  Save, 
  X,
  FileText
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ContentView() {
  const [activeTab, setActiveTab] = useState('sections');
  const [loading, setLoading] = useState(true);

  // Content states
  const [settings, setSettings] = useState({
    hero: { headline: '', subheadline: '' },
    about: { story: '', badge: '', founderMessage: '', founderName: '', founderTitle: '', founderPhoto: '' },
    stats: { rides: '50,000+', onTime: '99.8%', cities: '15+', rating: '4.9/5' }
  });
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Modals
  const [faqModal, setFaqModal] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General' });
  const [editingFaq, setEditingFaq] = useState(null);

  const [testModal, setTestModal] = useState(false);
  const [testForm, setTestForm] = useState({ name: '', role: '', comment: '', rating: 5, avatar: '' });
  const [editingTest, setEditingTest] = useState(null);

  const [galleryModal, setGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ title: '', image: '', category: 'Fleet' });

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [pubRes, setRes] = await Promise.allSettled([
        api.get('/content/public'),
        api.get('/content/settings')
      ]);

      if (pubRes.status === 'fulfilled') {
        const d = pubRes.value.data;
        if (d.faqs) setFaqs(d.faqs);
        if (d.testimonials) setTestimonials(d.testimonials);
        if (d.gallery) setGallery(d.gallery);
      }

      if (setRes.status === 'fulfilled' && setRes.value.data.settings) {
        setSettings(setRes.value.data.settings);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  // Save Settings / Texts
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/content/settings', settings);
      toast.success('Hero, About & Stats saved successfully!');
    } catch (e) {
      toast.error('Failed to save settings');
    }
  };

  // FAQ Handlers
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.put(`/content/faqs/${editingFaq._id}`, faqForm);
        toast.success('FAQ updated');
      } else {
        await api.post('/content/faqs', faqForm);
        toast.success('FAQ added');
      }
      setFaqModal(false);
      loadAllContent();
    } catch (e) {
      toast.error('Failed to save FAQ');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/content/faqs/${id}`);
      toast.success('FAQ deleted');
      loadAllContent();
    } catch (e) {
      toast.error('Failed to delete FAQ');
    }
  };

  // Testimonial Handlers
  const handleSaveTest = async (e) => {
    e.preventDefault();
    try {
      if (editingTest) {
        await api.put(`/content/testimonials/${editingTest._id}`, testForm);
        toast.success('Testimonial updated');
      } else {
        await api.post('/content/testimonials', testForm);
        toast.success('Testimonial added');
      }
      setTestModal(false);
      loadAllContent();
    } catch (e) {
      toast.error('Failed to save testimonial');
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/content/testimonials/${id}`);
      toast.success('Testimonial removed');
      loadAllContent();
    } catch (e) {
      toast.error('Failed to delete testimonial');
    }
  };

  // Gallery Handlers
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      await api.post('/content/gallery', galleryForm);
      toast.success('Image added to gallery');
      setGalleryModal(false);
      setGalleryForm({ title: '', image: '', category: 'Fleet' });
      loadAllContent();
    } catch (e) {
      toast.error('Failed to save gallery image');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/content/gallery/${id}`);
      toast.success('Image deleted');
      loadAllContent();
    } catch (e) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-2xl text-white">Content Manager</h1>
        <p className="text-xs text-gray-400 mt-1">Manage public website copy, hero texts, founder message, FAQs, reviews, and gallery</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'sections', label: 'Hero, Story & Stats' },
          { id: 'faqs', label: `FAQs (${faqs.length})` },
          { id: 'testimonials', label: `Testimonials (${testimonials.length})` },
          { id: 'gallery', label: `Gallery (${gallery.length})` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === t.id
                ? 'bg-orange text-white shadow-glow-orange'
                : 'glass text-gray-300 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Sections (Hero, About, Founder, Stats) */}
      {activeTab === 'sections' && (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Hero Section Copy */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange" /> Hero Section Copy
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={settings.hero?.headline || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    hero: { ...settings.hero, headline: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Subheadline</label>
                <textarea
                  rows="2"
                  value={settings.hero?.subheadline || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    hero: { ...settings.hero, subheadline: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange resize-none"
                />
              </div>
            </div>
          </div>

          {/* About Us & Founder Section */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange" /> About Page & Founder Story
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Company Story</label>
                <textarea
                  rows="3"
                  value={settings.about?.story || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    about: { ...settings.about, story: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Founder Name</label>
                  <input
                    type="text"
                    value={settings.about?.founderName || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      about: { ...settings.about, founderName: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Founder Photo URL</label>
                  <input
                    type="url"
                    value={settings.about?.founderPhoto || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      about: { ...settings.about, founderPhoto: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Founder Message</label>
                <textarea
                  rows="2"
                  value={settings.about?.founderMessage || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    about: { ...settings.about, founderMessage: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange resize-none"
                />
              </div>
            </div>
          </div>

          {/* Stats Counters */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Stats Numbers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Trips Completed</label>
                <input
                  type="text"
                  value={settings.stats?.rides || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, rides: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">On-Time %</label>
                <input
                  type="text"
                  value={settings.stats?.onTime || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, onTime: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Cities Network</label>
                <input
                  type="text"
                  value={settings.stats?.cities || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, cities: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Customer Rating</label>
                <input
                  type="text"
                  value={settings.stats?.rating || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, rating: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange to-orange-glow text-white text-xs font-bold shadow-glow-orange flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Content Changes
          </button>
        </form>
      )}

      {/* TAB 2: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ question: '', answer: '', category: 'General' });
                setFaqModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-orange text-white text-xs font-bold shadow-glow-orange flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq._id} className="p-4 rounded-2xl glass border border-white/10 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">{faq.question}</h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq(faq);
                      setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category });
                      setFaqModal(true);
                    }}
                    className="p-1.5 rounded-lg glass text-gray-300 hover:text-orange"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq._id)}
                    className="p-1.5 rounded-lg glass text-gray-300 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingTest(null);
                setTestForm({ name: '', role: '', comment: '', rating: 5, avatar: '' });
                setTestModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-orange text-white text-xs font-bold shadow-glow-orange flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((test) => (
              <div key={test._id} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={test.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={test.name}
                      className="w-10 h-10 rounded-full object-cover border border-orange"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{test.name}</h4>
                      <p className="text-[11px] text-orange">{test.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 italic mb-3 leading-relaxed">"{test.comment}"</p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-amber-400 text-xs">{'★'.repeat(test.rating || 5)}</span>
                  <button
                    onClick={() => handleDeleteTest(test._id)}
                    className="p-1 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Gallery */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setGalleryModal(true)}
              className="px-4 py-2 rounded-xl bg-orange text-white text-xs font-bold shadow-glow-orange flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Image
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div key={item._id} className="h-44 rounded-2xl overflow-hidden glass border border-white/10 relative group">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-white truncate">{item.title}</span>
                  <button
                    onClick={() => handleDeleteGallery(item._id)}
                    className="self-end p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-white/15 rounded-3xl p-6 shadow-glass text-softWhite">
            <h3 className="font-heading font-bold text-lg text-white mb-4">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h3>
            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Answer</label>
                <textarea
                  rows="3"
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange resize-none"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange text-white text-xs font-bold">
                  Save
                </button>
                <button type="button" onClick={() => setFaqModal(false)} className="py-2.5 px-4 rounded-xl glass text-xs text-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {testModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-white/15 rounded-3xl p-6 shadow-glass text-softWhite">
            <h3 className="font-heading font-bold text-lg text-white mb-4">{editingTest ? 'Edit Review' : 'Add Review'}</h3>
            <form onSubmit={handleSaveTest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={testForm.name}
                  onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Role / Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Director, Infosys"
                  value={testForm.role}
                  onChange={(e) => setTestForm({ ...testForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Review Comment</label>
                <textarea
                  rows="3"
                  required
                  value={testForm.comment}
                  onChange={(e) => setTestForm({ ...testForm, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange resize-none"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange text-white text-xs font-bold">
                  Save Review
                </button>
                <button type="button" onClick={() => setTestModal(false)} className="py-2.5 px-4 rounded-xl glass text-xs text-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-white/15 rounded-3xl p-6 shadow-glass text-softWhite">
            <h3 className="font-heading font-bold text-lg text-white mb-4">Add Gallery Image</h3>
            <form onSubmit={handleSaveGallery} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Title / Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxury Mercedes Convoy"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={galleryForm.image}
                  onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white text-xs focus:outline-none focus:border-orange"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange text-white text-xs font-bold">
                  Add to Gallery
                </button>
                <button type="button" onClick={() => setGalleryModal(false)} className="py-2.5 px-4 rounded-xl glass text-xs text-gray-300">
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
