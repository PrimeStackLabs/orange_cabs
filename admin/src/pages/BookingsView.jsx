import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit3, 
  CheckCircle, 
  X, 
  Printer, 
  Phone, 
  User, 
  Car,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BookingsView() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Resource lists
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Edit / Dispatch Modal
  const [editBooking, setEditBooking] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Pending');

  // Manual Booking Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickup: '',
    drop: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    cabType: 'Sedan',
    passengers: 1,
    message: 'Manual Booking by Admin'
  });

  const fetchResources = async () => {
    try {
      const [dRes, vRes] = await Promise.allSettled([
        api.get('/drivers'),
        api.get('/vehicles')
      ]);
      if (dRes.status === 'fulfilled' && dRes.value.data.drivers) {
        setDrivers(dRes.value.data.drivers);
      }
      if (vRes.status === 'fulfilled' && vRes.value.data.vehicles) {
        setVehicles(vRes.value.data.vehicles);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 15,
        status: statusFilter !== 'All' ? statusFilter : '',
        search
      });
      const { data } = await api.get(`/bookings?${params}`);
      if (data.success) {
        setBookings(data.bookings || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleOpenEdit = (b) => {
    setEditBooking(b);
    setSelectedStatus(b.status || 'Pending');
    setSelectedDriver(b.driver?._id || b.driver || '');
    setSelectedVehicle(b.vehicle?._id || b.vehicle || '');
  };

  const handleSaveDispatch = async (e) => {
    e.preventDefault();
    if (!editBooking) return;
    try {
      // Update status
      await api.patch(`/bookings/${editBooking._id}/status`, { status: selectedStatus });

      // Update driver & vehicle if provided
      if (selectedDriver || selectedVehicle) {
        await api.patch(`/bookings/${editBooking._id}/assign`, {
          driverId: selectedDriver || null,
          vehicleId: selectedVehicle || null
        });
      }

      toast.success(`Booking ${editBooking.bookingId} updated successfully`);
      setEditBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update booking status');
    }
  };

  const handleCreateManualBooking = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/bookings', { ...manualForm, source: 'Admin Portal' });
      if (data.success) {
        toast.success(`Manual booking created: ${data.bookingId}`);
        setManualModalOpen(false);
        setManualForm({
          name: '',
          phone: '',
          email: '',
          pickup: '',
          drop: '',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          cabType: 'Sedan',
          passengers: 1,
          message: 'Manual Booking by Admin'
        });
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create manual booking');
    }
  };

  const exportCSV = () => {
    if (!bookings.length) {
      toast.error('No bookings to export');
      return;
    }
    const headers = ['Booking ID,Name,Phone,Pickup,Drop,Date,Time,Cab Type,Status\n'];
    const rows = bookings.map(b => 
      `"${b.bookingId}","${b.name || b.customerName}","${b.phone || b.customerPhone}","${b.pickup || b.pickupCity}","${b.drop || b.dropCity}","${b.date || b.pickupDate}","${b.time || b.pickupTime}","${b.cabType}","${b.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OrangeCab_Bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl text-white">Bookings Management</h1>
          <p className="text-xs text-gray-400 mt-1">Total {total} bookings registered in system</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl glass hover:border-orange text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-orange" /> Export CSV
          </button>

          <button
            onClick={() => setManualModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange to-orange-glow text-white text-xs font-bold shadow-glow-orange flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Manual Booking
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search booking ID, customer name, phone, pickup, drop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs focus:outline-none focus:border-orange"
          />
        </form>

        <div className="flex gap-2">
          {['All', 'Pending', 'Confirmed', 'Assigned', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-orange text-white shadow-glow-orange'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-gray-400 border-b border-white/10 uppercase">
              <tr>
                <th className="p-4 font-semibold">Booking ID</th>
                <th className="p-4 font-semibold">Passenger</th>
                <th className="p-4 font-semibold">Route & Schedule</th>
                <th className="p-4 font-semibold">Cab Type</th>
                <th className="p-4 font-semibold">Driver / Vehicle</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No bookings found matching filter.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const custName = b.name || b.customerName;
                  const custPhone = b.phone || b.customerPhone;
                  const pickupLoc = b.pickup || b.pickupCity;
                  const dropLoc = b.drop || b.dropCity;
                  const tripDate = b.date || b.pickupDate;
                  const tripTime = b.time || b.pickupTime;

                  return (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-orange">{b.bookingId}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block">{custName}</span>
                        <span className="text-[11px] text-gray-400">{custPhone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-medium block">{pickupLoc} → {dropLoc}</span>
                        <span className="text-[11px] text-gray-400">{tripDate} at {tripTime}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white">{b.cabType}</span>
                        <span className="text-[10px] text-gray-400 block">{b.passengers || 1} Pax</span>
                      </td>
                      <td className="p-4">
                        {b.driver ? (
                          <div>
                            <span className="text-white block font-medium">{b.driver.name}</span>
                            <span className="text-[11px] text-orange font-mono">
                              {b.vehicle?.registrationNumber || 'Assigned'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                          b.status === 'Assigned' ? 'bg-blue-500/20 text-blue-400' :
                          b.status === 'Completed' ? 'bg-purple-500/20 text-purple-400' :
                          b.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* WhatsApp Confirm Link */}
                          <a
                            href={`https://wa.me/${custPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${custName}, your Orange Cab booking ${b.bookingId} (${b.cabType}) for ${pickupLoc} to ${dropLoc} on ${tripDate} is confirmed! Our 24/7 team is at your service.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                            title="WhatsApp Confirmation Link"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit / Dispatch */}
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="p-1.5 rounded-lg glass text-orange hover:bg-orange hover:text-white transition-colors"
                            title="Workflow & Assign Driver"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Showing page {page} of {pages} ({total} items)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg glass text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page >= pages}
              className="p-1.5 rounded-lg glass text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dispatch & Status Workflow Modal */}
      {editBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-white/15 rounded-3xl p-6 shadow-glass text-softWhite">
            <button
              onClick={() => setEditBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-lg text-white mb-1">
              Dispatch Booking {editBooking.bookingId}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {editBooking.name || editBooking.customerName} • {editBooking.pickup} → {editBooking.drop}
            </p>

            <form onSubmit={handleSaveDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">Status Workflow</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy/70 border border-white/15 text-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Assign Driver</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy/70 border border-white/15 text-white"
                >
                  <option value="">-- Select Driver --</option>
                  {drivers.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.phone}) • {d.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Assign Vehicle</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy/70 border border-white/15 text-white"
                >
                  <option value="">-- Select Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>
                      {v.name} ({v.registrationNumber}) • {v.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange text-white font-bold"
                >
                  Save Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => setEditBooking(null)}
                  className="py-2.5 px-4 rounded-xl glass text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Booking Creation Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-surface border border-white/15 rounded-3xl p-6 sm:p-8 shadow-glass text-softWhite max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setManualModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-xl text-white mb-2">Create Manual Booking</h3>
            <p className="text-xs text-gray-400 mb-4">Direct dispatch reservation on behalf of phone or walk-in client</p>

            <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Passenger Name *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.pickup}
                    onChange={(e) => setManualForm({ ...manualForm, pickup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Drop Location *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.drop}
                    onChange={(e) => setManualForm({ ...manualForm, drop: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={manualForm.date}
                    onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Pickup Time *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.time}
                    onChange={(e) => setManualForm({ ...manualForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Cab Category</label>
                  <select
                    value={manualForm.cabType}
                    onChange={(e) => setManualForm({ ...manualForm, cabType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/70 border border-white/15 text-white"
                  >
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Innova">Innova</option>
                    <option value="Tempo Traveller">Tempo Traveller</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Passengers</label>
                  <input
                    type="number"
                    min="1"
                    value={manualForm.passengers}
                    onChange={(e) => setManualForm({ ...manualForm, passengers: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange to-orange-glow text-white font-bold shadow-glow-orange"
                >
                  Create Booking
                </button>
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="py-3 px-5 rounded-xl glass text-gray-300"
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
