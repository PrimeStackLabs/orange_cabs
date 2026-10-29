import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { API_BASE } from '../../services/apiConfig';
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/adminApi';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tripTypeFilter, setTripTypeFilter] = useState('all');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Form
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    tripType: 'airport_transfer',
    pickupLocation: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    preferredVehicle: 'Toyota Innova Crysta',
    passengerCount: 1,
    estimatedFare: '',
    finalFare: '',
    status: 'new',
    internalNotes: '',
  });

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings({
        search,
        status: statusFilter,
        tripType: tripTypeFilter,
      });
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('loadBookings error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [search, statusFilter, tripTypeFilter]);

  const formatRefId = (ref) => {
    if (!ref) return '#BK1200';
    if (ref.startsWith('SKB-')) {
      const parts = ref.split('-');
      return `#BK-${parts[parts.length - 1]}`;
    }
    return ref;
  };

  const formatTripType = (trip, pkg) => {
    if (pkg && pkg !== 'airport_transfer' && pkg !== 'outstation_round') return pkg;
    const map = {
      airport_transfer: 'Airport Transfer',
      local_4h_40km: 'Local 4H / 40KM',
      local_8h_80km: 'Local 8H / 80KM',
      outstation_round: 'Outstation Round',
      outstation_oneway: 'Outstation Drop',
      group_travel: 'Group Travel',
    };
    return map[trip] || trip || 'Custom Trip';
  };

  const formatStatus = (s) => {
    const status = s ? s.toLowerCase() : 'new';
    if (status === 'enquiry_received') return { label: 'Enquiry', cls: 'enquiry_received' };
    if (status === 'confirmed') return { label: 'Confirmed', cls: 'confirmed' };
    if (status === 'pending') return { label: 'Pending', cls: 'pending' };
    if (status === 'completed') return { label: 'Completed', cls: 'completed' };
    if (status === 'cancelled') return { label: 'Cancelled', cls: 'cancelled' };
    return { label: s || 'New', cls: status };
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await createBooking(form);
    setIsCreateOpen(false);
    loadBookings();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editBooking) return;
    await updateBooking(editBooking._id, editBooking);
    setEditBooking(null);
    loadBookings();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await deleteBooking(deleteId);
    setDeleteId(null);
    loadBookings();
  };

  const handleExportCsv = () => {
    window.open(`${API_BASE}/admin/bookings/export/csv`, '_blank');
  };

  return (
    <div className="admin-page-root">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h1 className="admin-page-heading">Booking Management</h1>
          <p className="admin-page-sub">
            Track, confirm, assign fleet and manage all customer ride reservations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn-admin-secondary" onClick={handleExportCsv}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => {
              setForm({
                fullName: '',
                phoneNumber: '',
                email: '',
                tripType: 'airport_transfer',
                pickupLocation: '',
                destination: '',
                travelDate: new Date().toISOString().split('T')[0],
                preferredVehicle: 'Toyota Innova Crysta',
                passengerCount: 1,
                estimatedFare: '',
                finalFare: '',
                status: 'new',
                internalNotes: '',
              });
              setIsCreateOpen(true);
            }}
          >
            <Plus size={16} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by ID, name, phone..."
            className="toolbar-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="toolbar-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="toolbar-select"
          value={tripTypeFilter}
          onChange={(e) => setTripTypeFilter(e.target.value)}
        >
          <option value="all">All Trip Types</option>
          <option value="airport_transfer">Airport Transfer</option>
          <option value="local_4h_40km">Local 4H / 40KM</option>
          <option value="local_8h_80km">Local 8H / 80KM</option>
          <option value="outstation_round">Outstation Round</option>
          <option value="outstation_oneway">Outstation One-Way</option>
          <option value="group_travel">Group Travel</option>
        </select>
      </div>

      {/* Bookings Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Trip Type</th>
                <th>Pickup & Destination</th>
                <th>Travel Date</th>
                <th>Vehicle</th>
                <th>Fare (₹)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No bookings found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const statusInfo = formatStatus(b.status);
                  return (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 800, color: '#071426', whiteSpace: 'nowrap' }} title={b.bookingReference}>
                        {formatRefId(b.bookingReference)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.fullName}</div>
                        {b.email && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{b.email}</div>}
                      </td>
                      <td>
                        <a href={`tel:${b.phoneNumber}`} style={{ color: '#0369a1', textDecoration: 'none', fontWeight: 600 }}>
                          {b.phoneNumber}
                        </a>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: 4, whiteSpace: 'nowrap' }}>
                          {formatTripType(b.tripType, b.tripTypeLabel)}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{b.pickupLocation}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>→ {b.destination}</div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                        {b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{b.preferredVehicle}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: b.finalFare ? '#15803d' : '#64748b' }}>
                          {b.finalFare ? `₹${b.finalFare}` : b.estimatedFare ? `~₹${b.estimatedFare}` : 'TBD'}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${statusInfo.cls}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn-icon-action"
                            title="View Details"
                            onClick={() => setViewBooking(b)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-action"
                            title="Edit Booking"
                            onClick={() => setEditBooking(b)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-action"
                            style={{ color: '#ef4444' }}
                            title="Delete Booking"
                            onClick={() => setDeleteId(b._id)}
                          >
                            <Trash2 size={15} />
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
      </div>

      {/* View Booking Modal */}
      {viewBooking && (
        <Modal
          isOpen={!!viewBooking}
          onClose={() => setViewBooking(null)}
          title={`Booking Details — ${viewBooking.bookingReference}`}
          footer={
            <button type="button" className="btn-admin-primary" onClick={() => setViewBooking(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <span className="admin-form-label">CUSTOMER NAME</span>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: 2 }}>{viewBooking.fullName}</div>
            </div>
            <div>
              <span className="admin-form-label">PHONE NUMBER</span>
              <div>
                <a href={`tel:${viewBooking.phoneNumber}`} style={{ fontWeight: 700, color: '#0369a1' }}>
                  {viewBooking.phoneNumber}
                </a>
              </div>
            </div>
            <div>
              <span className="admin-form-label">TRIP TYPE</span>
              <div>{viewBooking.tripTypeLabel || viewBooking.tripType}</div>
            </div>
            <div>
              <span className="admin-form-label">STATUS</span>
              <div>
                <span className={`status-pill ${viewBooking.status || 'new'}`}>{viewBooking.status || 'new'}</span>
              </div>
            </div>
            <div>
              <span className="admin-form-label">PICKUP LOCATION</span>
              <div>{viewBooking.pickupLocation}</div>
            </div>
            <div>
              <span className="admin-form-label">DESTINATION</span>
              <div>{viewBooking.destination}</div>
            </div>
            <div>
              <span className="admin-form-label">TRAVEL DATE</span>
              <div>{viewBooking.travelDate ? new Date(viewBooking.travelDate).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div>
              <span className="admin-form-label">PASSENGERS</span>
              <div>{viewBooking.passengerCount || 1}</div>
            </div>
            <div>
              <span className="admin-form-label">VEHICLE ASSIGNED / REQUESTED</span>
              <div>{viewBooking.preferredVehicle}</div>
            </div>
            <div>
              <span className="admin-form-label">FINAL FARE (₹)</span>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#15803d' }}>
                ₹{viewBooking.finalFare || viewBooking.estimatedFare || 'Pending Quote'}
              </div>
            </div>
            {viewBooking.internalNotes && (
              <div style={{ gridColumn: '1 / -1' }}>
                <span className="admin-form-label">INTERNAL DISPATCH NOTES</span>
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 4 }}>
                  {viewBooking.internalNotes}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Booking Modal */}
      {editBooking && (
        <Modal
          isOpen={!!editBooking}
          onClose={() => setEditBooking(null)}
          title={`Edit Booking — ${editBooking.bookingReference}`}
          footer={
            <>
              <button type="button" className="btn-admin-secondary" onClick={() => setEditBooking(null)}>
                Cancel
              </button>
              <button type="button" className="btn-admin-primary" onClick={handleEditSubmit}>
                Update Booking
              </button>
            </>
          }
        >
          <form onSubmit={handleEditSubmit}>
            <div className="form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Customer Name</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={editBooking.fullName}
                  onChange={(e) => setEditBooking({ ...editBooking, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Phone Number</label>
                <input
                  type="tel"
                  className="admin-form-input"
                  value={editBooking.phoneNumber}
                  onChange={(e) => setEditBooking({ ...editBooking, phoneNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select
                  className="admin-form-select"
                  value={editBooking.status}
                  onChange={(e) => setEditBooking({ ...editBooking, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Agreed / Final Fare (₹)</label>
                <input
                  type="number"
                  className="admin-form-input"
                  value={editBooking.finalFare || ''}
                  placeholder="e.g. 2400"
                  onChange={(e) => setEditBooking({ ...editBooking, finalFare: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="admin-form-group">
                <label className="admin-form-label">Pickup Location</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={editBooking.pickupLocation}
                  onChange={(e) => setEditBooking({ ...editBooking, pickupLocation: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Destination</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={editBooking.destination}
                  onChange={(e) => setEditBooking({ ...editBooking, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Internal Dispatch & Pricing Notes</label>
              <textarea
                className="admin-form-textarea"
                rows={3}
                placeholder="Driver details, toll inclusions, special customer instructions..."
                value={editBooking.internalNotes || ''}
                onChange={(e) => setEditBooking({ ...editBooking, internalNotes: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Create Booking Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Booking"
        footer={
          <>
            <button type="button" className="btn-admin-secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn-admin-primary" onClick={handleCreateSubmit}>
              Save Booking
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit}>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Customer Name *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone Number *</label>
              <input
                type="tel"
                className="admin-form-input"
                placeholder="10-digit mobile"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Trip Type</label>
              <select
                className="admin-form-select"
                value={form.tripType}
                onChange={(e) => setForm({ ...form, tripType: e.target.value })}
              >
                <option value="airport_transfer">Airport Transfer</option>
                <option value="local_4h_40km">Local 4H / 40KM</option>
                <option value="local_8h_80km">Local 8H / 80KM</option>
                <option value="outstation_round">Outstation Round Trip</option>
                <option value="outstation_oneway">Outstation One Way</option>
                <option value="group_travel">Group / Family Travel</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Vehicle</label>
              <select
                className="admin-form-select"
                value={form.preferredVehicle}
                onChange={(e) => setForm({ ...form, preferredVehicle: e.target.value })}
              >
                <option value="Toyota Innova Crysta">Toyota Innova Crysta</option>
                <option value="Sedan 4+1 (Dzire / Etios)">Sedan 4+1 (Dzire / Etios)</option>
                <option value="Force Urbania">Force Urbania</option>
                <option value="Tempo Traveller (TT)">Tempo Traveller (TT)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Pickup Location *</label>
              <input
                type="text"
                className="admin-form-input"
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Destination *</label>
              <input
                type="text"
                className="admin-form-input"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Travel Date</label>
              <input
                type="date"
                className="admin-form-input"
                value={form.travelDate}
                onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Estimated Fare (₹)</label>
              <input
                type="number"
                className="admin-form-input"
                placeholder="e.g. 1900"
                value={form.estimatedFare}
                onChange={(e) => setForm({ ...form, estimatedFare: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking Record"
        message="Are you sure you want to permanently delete this booking record? This action cannot be undone."
      />
    </div>
  );
}
