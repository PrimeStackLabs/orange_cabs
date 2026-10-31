import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Award } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ReviewsView = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews/admin/all');
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (r) => {
    try {
      const newStatus = r.status === 'approved' ? 'pending' : 'approved';
      await api.put(`/reviews/admin/${r._id}`, { status: newStatus });
      toast.success(`Review ${newStatus}`);
      fetchReviews();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const toggleFeatured = async (r) => {
    try {
      await api.put(`/reviews/admin/${r._id}`, { featured: !r.featured });
      toast.success(r.featured ? 'Removed from featured' : 'Marked as featured on homepage');
      fetchReviews();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Passenger Reviews Moderation</h1>
        <p className="text-xs text-gray-400 mt-1">Approve, reject, or feature verified trip reviews on the public site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r._id} className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-orange">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  r.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {r.status}
                </span>
              </div>

              <p className="text-xs text-gray-300 italic mb-4 leading-relaxed">"{r.comment}"</p>

              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <img
                  src={r.avatar}
                  alt={r.authorName}
                  className="w-8 h-8 rounded-full object-cover border border-orange"
                />
                <div>
                  <h4 className="font-bold text-white text-xs">{r.authorName}</h4>
                  <span className="text-[10px] text-gray-400 block">{r.routeOrService}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
              <button
                onClick={() => toggleFeatured(r)}
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  r.featured ? 'text-orange' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{r.featured ? 'Featured' : 'Make Featured'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleApproval(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    r.status === 'approved' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}
                >
                  {r.status === 'approved' ? 'Unapprove' : 'Approve'}
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="p-1 rounded-lg text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsView;
