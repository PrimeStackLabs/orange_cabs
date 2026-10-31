import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Clock, Users, Plus, X, UserPlus, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function LogsView() {
  const { admin: currentAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
    phone: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsRes, usersRes] = await Promise.allSettled([
        api.get('/admin/logs'),
        api.get('/admin/users')
      ]);

      if (logsRes.status === 'fulfilled' && logsRes.value.data.logs) {
        setLogs(logsRes.value.data.logs);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.data.admins) {
        setUsers(usersRes.value.data.admins);
      }
    } catch (err) {
      toast.error('Failed to load logs or users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = editingUser
        ? await api.put(`/admin/users/${editingUser._id}`, userForm)
        : await api.post('/admin/users', userForm);
      if (data.success) {
        toast.success(editingUser ? `Admin user ${userForm.name} updated!` : `Admin user ${userForm.name} created!`);
        setShowAddModal(false);
        setEditingUser(null);
        setUserForm({ name: '', email: '', password: '', role: 'Staff', phone: '' });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete admin account for ${user.name} (${user.email})? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      toast.success(`Admin user ${user.name} deleted`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const closeUserModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setUserForm({ name: '', email: '', password: '', role: 'Staff', phone: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">System Users & Audit Logs</h1>
          <p className="text-xs text-gray-400 mt-1">Manage staff portal access and inspect immutable security logs</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'users' && (
            <button
              onClick={() => {
                setEditingUser(null);
                setUserForm({ name: '', email: '', password: '', role: 'Staff', phone: '' });
                setShowAddModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange to-orange-glow text-white text-xs font-bold shadow-glow-orange flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add Staff Member
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'logs' ? 'bg-orange text-white shadow-glow-orange' : 'glass text-gray-300'
          }`}
        >
          Activity Logs ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users' ? 'bg-orange text-white shadow-glow-orange' : 'glass text-gray-300'
          }`}
        >
          Admin & Staff Users ({users.length})
        </button>
      </div>

      {/* TAB 1: Activity Logs */}
      {activeTab === 'logs' && (
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10 uppercase">
                <tr>
                  <th className="p-4 font-semibold">Action / Event</th>
                  <th className="p-4 font-semibold">Details</th>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      No logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{l.action}</td>
                      <td className="p-4 text-gray-300">{l.details}</td>
                      <td className="p-4 font-medium text-orange">{l.adminName || 'System'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase font-mono">
                          {l.category || 'system'}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-400 font-mono">
                        {new Date(l.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Users */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-gray-400 border-b border-white/10 uppercase">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 font-mono text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'Super Admin' ? 'bg-orange/20 text-orange' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{u.phone || '—'}</td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-semibold">Active</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditUser(u)}
                          aria-label={`Edit ${u.name}`}
                          className="rounded-lg p-2 text-blue-300 hover:bg-blue-500/15 hover:text-blue-200"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          disabled={String(u._id) === String(currentAdmin?._id || currentAdmin?.id)}
                          aria-label={`Delete ${u.name}`}
                          className="rounded-lg p-2 text-red-300 hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin account modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface border border-white/15 rounded-3xl p-6 shadow-glass text-softWhite">
            <button onClick={closeUserModal} className="absolute top-5 right-5 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              {editingUser ? 'Edit Admin Account' : 'Add Staff Member'}
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  {editingUser ? 'New Password (optional)' : 'Temporary Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                  className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    disabled={Boolean(editingUser && String(editingUser._id) === String(currentAdmin?._id || currentAdmin?.id))}
                    className="w-full px-3 py-2 rounded-xl bg-navy/70 border border-white/15 text-white"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Support">Support</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy/60 border border-white/15 text-white"
                  />
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange text-white font-bold">
                  {editingUser ? 'Save Changes' : 'Create Member'}
                </button>
                <button type="button" onClick={closeUserModal} className="py-2.5 px-4 rounded-xl glass text-gray-300">
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
