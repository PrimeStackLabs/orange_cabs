import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Car, 
  Printer, 
  XCircle, 
  Star, 
  User, 
  Phone, 
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const { user, loading: authLoading, setIsAuthOpen, setAuthMode } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [commentVal, setCommentVal] = useState('');
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of schedule');

  const fetchUserBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setAuthMode('login');
        setIsAuthOpen(true);
      } else {
        fetchUserBookings();
      }
    }
  }, [user, authLoading]);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    try {
      const { data } = await api.post(`/bookings/${cancelModalBooking.bookingId}/cancel`, {
        reason: cancelReason
      });
      if (data.success) {
        toast.success('Booking cancelled successfully');
        setCancelModalBooking(null);
        fetchUserBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModalBooking) return;
    try {
      const { data } = await api.post(`/bookings/${reviewModalBooking.bookingId}/review`, {
        rating: ratingVal,
        comment: commentVal
      });
      if (data.success) {
        toast.success('Thank you for rating your trip!');
        setReviewModalBooking(null);
        fetchUserBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
      case 'Assigned':
        return <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{status}</span>;
      case 'On Trip':
        return <span className="px-3 py-1 rounded-full bg-orange/20 text-orange text-xs font-bold animate-pulse">On Trip</span>;
      case 'Completed':
        return <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Completed</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-navy text-softWhite pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* Background glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* User Profile Card */}
        {user && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange/20 border border-orange flex items-center justify-center text-orange font-heading font-black text-2xl shadow-glow-orange">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-white">{user.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-orange" />
                    {user.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-orange" />
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/book')}
                className="btn-shine px-5 py-2.5 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-xs shadow-glow-orange"
              >
                + Book New Ride
              </button>
            </div>
          </div>
        )}

        {/* Bookings List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-2xl text-white">Your Bookings History</h2>
            <span className="text-xs text-gray-400">{bookings.length} total ride(s)</span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-400">Loading your reservations...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl border border-white/10 text-center">
              <Car className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-lg text-white mb-2">No Bookings Found</h3>
              <p className="text-xs text-gray-400 mb-6">You haven't reserved any rides yet. Book your first journey with zero cancellation fees!</p>
              <button
                onClick={() => navigate('/book')}
                className="px-6 py-2.5 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-xs shadow-glow-orange"
              >
                Book A Cab Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-orange">{b.bookingId}</span>
                      {getStatusBadge(b.status)}
                      <span className="text-xs text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span>{b.pickupCity}</span>
                      <span className="text-orange">→</span>
                      <span>{b.dropCity}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span>Date: <strong className="text-gray-200">{b.pickupDate} ({b.pickupTime})</strong></span>
                      <span>•</span>
                      <span>Vehicle: <strong className="text-gray-200">{b.cabType}</strong></span>
                      <span>•</span>
                      <span>Fare: <strong className="text-orange">₹{b.fareDetails?.totalFare}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => navigate(`/track?bookingId=${b.bookingId}&phone=${b.customerPhone}`)}
                      className="px-3.5 py-1.5 rounded-xl glass hover:border-orange text-xs font-semibold text-white transition-all"
                    >
                      Track Cab
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl glass hover:border-white text-xs text-gray-300 hover:text-white flex items-center gap-1.5"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5 text-orange" />
                      <span>Invoice</span>
                    </button>

                    {b.status === 'Completed' && !b.userReview?.rating && (
                      <button
                        onClick={() => {
                          setReviewModalBooking(b);
                          setRatingVal(5);
                          setCommentVal('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-orange/20 border border-orange text-orange hover:bg-orange hover:text-white text-xs font-bold transition-all"
                      >
                        Rate Trip ★
                      </button>
                    )}

                    {(b.status === 'Pending' || b.status === 'Confirmed') && (
                      <button
                        onClick={() => setCancelModalBooking(b)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
            <div className="glass-card border border-white/20 p-6 rounded-3xl max-w-md w-full shadow-2xl">
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                Cancel Booking {cancelModalBooking.bookingId}?
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Free cancellation is active. Please let us know the reason:
              </p>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 rounded-xl glass text-xs text-gray-300 hover:text-white"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating & Review Modal */}
        {reviewModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
            <div className="glass-card border border-white/20 p-6 rounded-3xl max-w-md w-full shadow-2xl">
              <h3 className="font-heading font-bold text-lg text-white mb-1">
                Rate Your Journey
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Trip: {reviewModalBooking.pickupCity} → {reviewModalBooking.dropCity}
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-300 mb-2">Select Stars</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingVal(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            ratingVal >= star ? 'text-orange fill-current' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Your Feedback / Review</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the chauffeur cleanliness, punctuality..."
                    value={commentVal}
                    onChange={(e) => setCommentVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalBooking(null)}
                    className="px-4 py-2 rounded-xl glass text-xs text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine px-5 py-2 rounded-xl bg-orange hover:bg-orange-glow text-white text-xs font-bold shadow-glow-orange"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookingsPage;
