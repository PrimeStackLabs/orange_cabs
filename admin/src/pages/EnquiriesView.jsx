import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Bot, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EnquiriesView = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [tab, setTab] = useState('enquiries'); // 'enquiries' or 'chat'
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [eRes, cRes] = await Promise.all([
        api.get('/enquiries/admin/all'),
        api.get('/chat/admin/sessions')
      ]);
      if (eRes.data.success) setEnquiries(eRes.data.enquiries);
      if (cRes.data.success) setChatSessions(cRes.data.sessions);
    } catch (err) {
      toast.error('Failed to load enquiries/chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/admin/${id}`, { status });
      toast.success(`Enquiry marked as ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Leads & Chatbot Inbox</h1>
          <p className="text-xs text-gray-400 mt-1">Review website contact requests and visitor chatbot interactions</p>
        </div>

        <div className="flex rounded-xl glass p-1 border border-white/10">
          <button
            onClick={() => setTab('enquiries')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
              tab === 'enquiries' ? 'bg-orange text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Quote Enquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setTab('chat')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
              tab === 'chat' ? 'bg-orange text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Chatbot Conversations ({chatSessions.length})
          </button>
        </div>
      </div>

      {tab === 'enquiries' ? (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div key={e._id} className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="font-heading font-bold text-base text-white">{e.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange/20 text-orange font-bold uppercase">
                    {e.serviceType}
                  </span>
                  <span className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <a href={`tel:${e.phone}`} className="text-orange hover:underline font-mono">{e.phone}</a>
                  <span>•</span>
                  <span>{e.email}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 italic pt-1">"{e.message}"</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={e.status}
                  onChange={(ev) => updateStatus(e._id, ev.target.value)}
                  className="px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
                >
                  <option value="New" className="bg-navy">New</option>
                  <option value="In Progress" className="bg-navy">In Progress</option>
                  <option value="Resolved" className="bg-navy">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {chatSessions.map((s) => (
            <div key={s._id} className="glass-card p-5 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-orange block">Session: {s._id}</span>
                <p className="text-xs text-white mt-1">Last Message: "{s.lastMessage}"</p>
                <span className="text-[10px] text-gray-400 block mt-1">
                  {s.count} exchanges • Updated: {new Date(s.updatedAt).toLocaleString()}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                Logged
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnquiriesView;
