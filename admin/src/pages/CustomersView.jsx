import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShieldCheck, Ban, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomersView = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/admin/customers');
      if (data.success) {
        setCustomers(data.users);
      }
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/admin/customers/${id}/toggle-status`);
      if (data.success) {
        toast.success(data.message);
        fetchCustomers();
      }
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Registered Customers</h1>
        <p className="text-xs text-gray-400 mt-1">Manage rider accounts, contact records, and access permissions</p>
      </div>

      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 text-gray-400 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Contact Email</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Account Status</th>
              <th className="p-4 font-semibold">Joined On</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {customers.map((c) => (
              <tr key={c._id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange/20 text-orange font-bold flex items-center justify-center">
                    {c.name.charAt(0)}
                  </div>
                  <span className="font-bold text-white">{c.name}</span>
                </td>
                <td className="p-4">{c.email}</td>
                <td className="p-4 font-mono">{c.phone}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleStatus(c._id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      c.status === 'active'
                        ? 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white'
                        : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white'
                    } transition-all`}
                  >
                    {c.status === 'active' ? 'Block Account' : 'Activate Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersView;
