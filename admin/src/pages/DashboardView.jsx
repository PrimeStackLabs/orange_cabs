import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CalendarDays, 
  Car, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend
} from 'recharts';
import api from '../services/api';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function DashboardView() {
  const { darkMode } = useAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const COLORS = ['#D92332', '#FF6B35', '#25D366', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

  const stats = data?.stats || {};
  const bookingsTrend = data?.bookingsTrend || [];
  const cabTypeDist = data?.cabTypeDist || [];
  const recentBookings = data?.recentBookings || [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Operations Overview</h1>
          <p className="text-xs text-gray-400 mt-1">Live metrics across fleet, bookings, enquiries and revenue</p>
        </div>
      </div>

      {/* 6 Requested KPI Glass Cards: total bookings, pending, confirmed, completed, enquiries, revenue */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* 1. Total Revenue */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-orange/20 text-orange flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-white mt-2 block">
            ₹{stats.totalRevenue?.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Est. completed trips</span>
        </div>

        {/* 2. Total Bookings */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Total Rides</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-white mt-2 block">
            {stats.totalBookings}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">All registered rides</span>
        </div>

        {/* 3. Pending Bookings */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-amber-400 mt-2 block">
            {stats.pendingBookings}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Awaiting driver assign</span>
        </div>

        {/* 4. Confirmed Bookings */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Confirmed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-emerald-400 mt-2 block">
            {stats.confirmedBookings}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Ready for departure</span>
        </div>

        {/* 5. Completed Bookings */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-white mt-2 block">
            {stats.completedBookings}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Successfully fulfilled</span>
        </div>

        {/* 6. Enquiries */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-black text-2xl text-pink-400 mt-2 block">
            {stats.enquiriesCount}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">Website & Chat Leads</span>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bookings / Revenue Trend Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-white/10">
          <h3 className="font-heading font-bold text-base text-white mb-4">
            Booking Demand Trend
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingsTrend}>
                <defs>
                  <linearGradient id="bookingTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D92332" stopOpacity={darkMode ? 0.32 : 0.2} />
                    <stop offset="95%" stopColor="#D92332" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 5" stroke={darkMode ? 'rgba(255,255,255,0.08)' : '#E8EAED'} />
                <XAxis dataKey="month" stroke={darkMode ? '#94A3B8' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={darkMode ? '#94A3B8' : '#64748B'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#181818' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(217, 35, 50, 0.4)' : '#E5E7EB'}`,
                    borderRadius: '12px',
                    color: darkMode ? '#fff' : '#242424',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }}
                />
                <Area
                  type="natural"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="#D92332"
                  strokeWidth={3}
                  fill="url(#bookingTrendGradient)"
                  dot={{ fill: '#FFFFFF', stroke: '#D92332', strokeWidth: 3, r: 4 }}
                  activeDot={{ fill: '#D92332', stroke: '#FFFFFF', strokeWidth: 2, r: 7 }}
                  isAnimationActive
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cab Types Donut Chart */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <h3 className="font-heading font-bold text-base text-white mb-2">
            Rides by Vehicle Type
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cabTypeDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cabTypeDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-white/10">
            {cabTypeDist.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{c.name}: {c.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-base text-white">
            Recent Booking Dispatches
          </h3>
          <span className="text-xs text-orange font-semibold">Live Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy/70 text-gray-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Passenger</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Cab Type</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-gray-200">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange">{b.bookingId}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{b.name || b.customerName}</td>
                  <td className="py-3.5 px-4 text-gray-300 truncate max-w-[200px]">
                    {b.pickup} → {b.drop}
                  </td>
                  <td className="py-3.5 px-4">{b.cabType}</td>
                  <td className="py-3.5 px-4">{b.date} • {b.time}</td>
                  <td className="py-3.5 px-4">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
