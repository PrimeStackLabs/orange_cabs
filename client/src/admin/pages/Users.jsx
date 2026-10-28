import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, UserCog, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { getUsers, createUser, updateUser, deleteUser } from '../services/adminApi';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'booking_manager',
    phone: '',
    isActive: true,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res || []);
    } catch (err) {
      console.error('loadUsers error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'booking_manager',
      phone: '',
      isActive: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '', // blank means keep current password
      role: user.role || 'booking_manager',
      phone: user.phone || '',
      isActive: user.isActive !== false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and Email Address are required.');
      return;
    }

    if (!editingUser && (!form.password || form.password.length < 6)) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (editingUser && form.password && form.password.length < 6) {
      setFormError('If updating password, it must be at least 6 characters.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    try {
      if (editingUser) {
        const payload = {
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          role: form.role,
          phone: form.phone.trim(),
          isActive: form.isActive,
        };
        if (form.password && form.password.trim().length >= 6) {
          payload.password = form.password.trim();
        }
        await updateUser(editingUser._id, payload);
        setFeedbackMsg(`Administrator ${form.name} updated successfully.`);
      } else {
        await createUser({
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
          role: form.role,
          phone: form.phone.trim(),
          isActive: form.isActive,
        });
        setFeedbackMsg(`Administrator ${form.name} created successfully.`);
      }

      setIsModalOpen(false);
      await loadUsers();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      setFeedbackMsg('Administrator account deleted successfully.');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      console.error('Delete user error', err);
    } finally {
      setDeleteId(null);
      loadUsers();
    }
  };

  return (
    <div className="admin-page-root">
      <div className="admin-page-header">
        <div className="admin-page-title-box">
          <h1 className="admin-page-heading">Administrator User Accounts</h1>
          <p className="admin-page-sub">
            Manage administrative credentials, assign roles (Super Admin, Booking Manager, Fleet Manager).
          </p>
        </div>

        <button
          type="button"
          className="btn-admin-primary"
          onClick={handleOpenAdd}
        >
          <Plus size={16} />
          <span>Add Admin User</span>
        </button>
      </div>

      {feedbackMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    Loading administrator accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No administrator accounts found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div className="item-avatar-user">
                          {u.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <span style={{ fontWeight: 700 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#0369a1', fontWeight: 500 }}>{u.email}</td>
                    <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                      {u.phone || '—'}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: 4,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: u.role === 'super_admin' ? '#fef8eb' : '#f1f5f9',
                          color: u.role === 'super_admin' ? '#b58019' : '#475569',
                        }}
                      >
                        {u.role === 'super_admin'
                          ? 'Super Admin'
                          : u.role === 'booking_manager'
                          ? 'Booking Manager'
                          : 'Fleet Manager'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${u.isActive !== false ? 'confirmed' : 'cancelled'}`}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : 'Initial'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          style={{ color: '#0284c7' }}
                          title="Edit Admin Account"
                          onClick={() => handleOpenEdit(u)}
                        >
                          <Edit2 size={15} />
                        </button>
                        {u.email !== 'admin@skbtravels.com' && (
                          <button
                            type="button"
                            className="btn-icon-action"
                            style={{ color: '#ef4444' }}
                            title="Delete Admin Account"
                            onClick={() => setDeleteId(u._id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Administrator Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingUser ? `Edit Administrator: ${editingUser.name}` : 'Add Administrator Account'}
        footer={
          <>
            <button
              type="button"
              className="btn-admin-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-admin-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingUser
                ? 'Update Administrator'
                : 'Create Admin'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '0.65rem 0.85rem',
                borderRadius: 6,
                marginBottom: '1rem',
                fontSize: '0.82rem',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Basavaraj Gowda"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email Address *</label>
              <input
                type="email"
                className="admin-form-input"
                placeholder="admin@skbtravels.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Phone Number</label>
              <input
                type="tel"
                className="admin-form-input"
                placeholder="e.g. 9035897960"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Administrative Role</label>
              <select
                className="admin-form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="super_admin">Super Admin (Full Access)</option>
                <option value="booking_manager">Booking Manager (Bookings & Enquiries)</option>
                <option value="fleet_manager">Fleet Manager (Vehicles & Drivers)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">
                {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
              </label>
              <input
                type="password"
                className="admin-form-input"
                placeholder={editingUser ? 'Leave blank to keep current password' : 'At least 6 characters'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editingUser}
                minLength={form.password ? 6 : undefined}
                autoComplete="new-password"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Account Status</label>
              <select
                className="admin-form-select"
                value={form.isActive ? 'active' : 'inactive'}
                onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })}
              >
                <option value="active">Active (Permitted to Log In)</option>
                <option value="inactive">Inactive (Suspended)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Admin Account"
        message="Are you sure you want to delete this administrator account? This action cannot be undone."
      />
    </div>
  );
}
