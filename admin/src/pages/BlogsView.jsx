import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const BlogsView = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalBlog, setModalBlog] = useState(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Travel Tips',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    author: 'Orange Cab Editorial'
  });

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs/admin/all');
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      toast.error('Failed to load blog articles');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAdd = () => {
    setModalBlog(null);
    setForm({
      title: '',
      slug: '',
      category: 'Travel Tips',
      excerpt: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      author: 'Orange Cab Editorial'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const slugVal = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = { ...form, slug: slugVal };

      if (modalBlog) {
        await api.put(`/blogs/${modalBlog._id}`, payload);
        toast.success('Article updated');
      } else {
        await api.post('/blogs', payload);
        toast.success('Article published');
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete article?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Article deleted');
      fetchBlogs();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Blog & CMS Manager</h1>
          <p className="text-xs text-gray-400 mt-1">Create and edit SEO travel guides, route spotlights, and tips</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-shine px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-xs shadow-glow-orange flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <div key={b._id} className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between">
            <div>
              <div className="h-40 relative">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-orange px-2.5 py-0.5 rounded text-[11px] font-bold text-white">
                  {b.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-base text-white line-clamp-2">{b.title}</h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{b.excerpt}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-400">By {b.author}</span>
              <button
                onClick={() => handleDelete(b._id)}
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
          <div className="glass-card border border-white/20 p-6 sm:p-8 rounded-3xl max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 p-1 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-xl text-white mb-4">Write / Edit Article</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Best Cafés to Visit on the Bangalore-Mysore Expressway"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Full Article Content *</label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl glass text-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsView;
