import React, { useState, useEffect } from 'react';
import { Search, Download, Star, Phone, Mail, Calendar, Eye, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';
import { getCustomers, updateCustomer } from '../services/adminApi';
import { API_BASE } from '../../services/apiConfig';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editNotesCust, setEditNotesCust] = useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers({ search });
      setCustomers(res.customers || []);
    } catch (err) {
      console.error('loadCustomers error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!editNotesCust) return;
    await updateCustomer(editNotesCust._id, {
      notes: editNotesCust.notes,
      isVip: editNotesCust.isVip,
    });
    setEditNotesCust(null);
    loadCustomers();
  };

  const handleExportCsv = () => {
    window.open(`${API_BASE}/admin/customers/export/csv`, '_blank');
  };

  return (
    <div className="admin-page-root">
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h1 className="admin-page-heading">Customer Directory</h1>
          <p className="admin-page-sub">
            Unified customer profiles aggregated from confirmed rides and verified WhatsApp enquiries.
          </p>
        </div>

        <button type="button" className="btn-admin-secondary" onClick={handleExportCsv}>
          <Download size={15} />
          <span>Export Customers CSV</span>
        </button>
      </div>

      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by customer name, phone or email..."
            className="toolbar-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Total Bookings</th>
                <th>Last Trip</th>
                <th>VIP Status</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No customer profiles found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div className="item-avatar-user">
                          {c.name?.charAt(0) || 'C'}
                        </div>
                        <span style={{ fontWeight: 700 }}>{c.name}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`tel:${c.phoneNumber}`} style={{ color: '#0369a1', textDecoration: 'none', fontWeight: 600 }}>
                        {c.phoneNumber}
                      </a>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{c.email || '—'}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#071426' }}>{c.totalBookings || 1} rides</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {c.lastTripDate ? new Date(c.lastTripDate).toLocaleDateString('en-GB') : 'Recent'}
                    </td>
                    <td>
                      {c.isVip ? (
                        <span className="status-pill confirmed" style={{ gap: 4 }}>
                          <Star size={12} fill="#15803d" />
                          <span>VIP</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#475569', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.notes || 'No notes'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="View Profile"
                          onClick={() => setViewCustomer(c)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="Edit Notes"
                          onClick={() => setEditNotesCust({ ...c })}
                        >
                          <Edit2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Customer Modal */}
      {viewCustomer && (
        <Modal
          isOpen={!!viewCustomer}
          onClose={() => setViewCustomer(null)}
          title={`Customer Profile — ${viewCustomer.name}`}
          footer={
            <button type="button" className="btn-admin-primary" onClick={() => setViewCustomer(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
            <div>
              <span className="admin-form-label">CUSTOMER NAME</span>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{viewCustomer.name}</div>
            </div>
            <div>
              <span className="admin-form-label">PHONE NUMBER</span>
              <div>
                <a href={`tel:${viewCustomer.phoneNumber}`} style={{ fontWeight: 700, color: '#0369a1' }}>
                  {viewCustomer.phoneNumber}
                </a>
              </div>
            </div>
            <div>
              <span className="admin-form-label">EMAIL ADDRESS</span>
              <div>{viewCustomer.email || 'Not provided'}</div>
            </div>
            <div>
              <span className="admin-form-label">LOYALTY TIER</span>
              <div>{viewCustomer.isVip ? 'VIP Customer' : 'Standard Passenger'}</div>
            </div>
            <div>
              <span className="admin-form-label">TOTAL COMPLETED RESERVATIONS</span>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#15803d' }}>
                {viewCustomer.totalBookings || 1}
              </div>
            </div>
            <div>
              <span className="admin-form-label">LAST RECORDED TRIP</span>
              <div>{viewCustomer.lastTripDate ? new Date(viewCustomer.lastTripDate).toLocaleDateString() : 'Recent'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <span className="admin-form-label">INTERNAL DISPATCHER NOTES</span>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 4 }}>
                {viewCustomer.notes || 'No customer-specific preferences recorded yet.'}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Notes / VIP Modal */}
      {editNotesCust && (
        <Modal
          isOpen={!!editNotesCust}
          onClose={() => setEditNotesCust(null)}
          title={`Edit Notes — ${editNotesCust.name}`}
          footer={
            <>
              <button type="button" className="btn-admin-secondary" onClick={() => setEditNotesCust(null)}>
                Cancel
              </button>
              <button type="button" className="btn-admin-primary" onClick={handleSaveNotes}>
                Save Notes
              </button>
            </>
          }
        >
          <form onSubmit={handleSaveNotes}>
            <div className="admin-form-group">
              <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={editNotesCust.isVip || false}
                  onChange={(e) => setEditNotesCust({ ...editNotesCust, isVip: e.target.checked })}
                />
                <span>Mark as VIP Customer (Priority booking & fleet allocation)</span>
              </label>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Dispatcher Notes & Preferences</label>
              <textarea
                className="admin-form-textarea"
                rows={3}
                placeholder="Preferred vehicle, favorite routes, corporate payment method..."
                value={editNotesCust.notes || ''}
                onChange={(e) => setEditNotesCust({ ...editNotesCust, notes: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
