import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, ArrowRight, X } from 'lucide-react';
import api from '../services/api';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get('/blogs');
        if (data.success) {
          setBlogs(data.blogs);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-navy text-softWhite pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        <div className="page-hero-surface text-center max-w-3xl mx-auto mb-16 rounded-3xl border border-white/10 px-6 py-12 sm:px-10 sm:py-16">
          <span className="text-xs font-bold text-orange tracking-widest uppercase">
            Stories & Highway Guides
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-white mt-2">
            The Orange Cabs Travel Journal
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mt-3 font-light leading-relaxed">
            Insider route guides, money-saving advice, best roadside dining recommendations, and road trip inspiration across South India.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 group"
            >
              <div>
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-surface via-transparent to-black/30" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange text-white text-xs font-bold shadow-glow-orange">
                    {b.category}
                  </span>
                  <span className="absolute bottom-3 left-3 text-xs text-gray-300 bg-navy/80 px-2 py-0.5 rounded-md backdrop-blur-md">
                    {b.readTime}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-orange transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                    {b.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {b.tags?.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">By {b.author}</span>
                <button
                  onClick={() => setSelectedBlog(b)}
                  className="text-xs font-bold text-orange hover:text-orange-glow flex items-center gap-1"
                >
                  Read Story
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Read Blog Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card border border-white/20 p-6 sm:p-10 rounded-3xl shadow-2xl">
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-64 sm:h-80 rounded-2xl overflow-hidden mb-6">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-orange font-semibold mb-2">
                <span>{selectedBlog.category}</span>
                <span>•</span>
                <span>{selectedBlog.readTime}</span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-4">
                {selectedBlog.title}
              </h2>

              <div className="text-xs text-gray-400 mb-6 pb-4 border-b border-white/10">
                Written by <strong className="text-white">{selectedBlog.author}</strong> on {new Date(selectedBlog.createdAt).toLocaleDateString()}
              </div>

              <div className="text-sm text-gray-300 space-y-4 leading-relaxed whitespace-pre-line font-light">
                {selectedBlog.content}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-6 py-2.5 rounded-xl bg-orange hover:bg-orange-glow text-white text-xs font-bold shadow-glow-orange"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogPage;
