import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Car,
  Star,
  Plus,
  MessageSquare,
  Package,
  UserCheck,
  Settings,
  ExternalLink,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  ArrowRight,
  FileBarChart,
  Navigation,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import {
  getDashboardStats,
  getDashboardOverview,
  createBooking,
  createEnquiry,
  updateVehicleStatus,
} from '../services/adminApi';

export default function Dashboard() {
  const navigate = useNavigate();

  // Instant local-first hydration (ZERO loading delay!)
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('skb_cached_dashboard_stats');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [overview, setOverview] = useState(() => {
    try {
      const cached = localStorage.getItem('skb_cached_dashboard_overview_week');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!stats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Live');
  const [period, setPeriod] = useState('week');

  // Interactive Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const calendarRef = useRef(null);

  // Modals for Quick Actions
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [viewEnquiry, setViewEnquiry] = useState(null);

  // Form states
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    phoneNumber: '',
    tripType: 'airport_transfer',
    pickupLocation: '',
    destination: '',
    travelDate: new Date().toISOString().split('T')[0],
    preferredVehicle: 'Toyota Innova Crysta',
    passengerCount: 1,
    estimatedFare: '',
    status: 'confirmed',
  });

  const [enquiryForm, setEnquiryForm] = useState({
    customerName: '',
    phoneNumber: '',
    tripType: 'Outstation Trip',
    pickupLocation: 'Bengaluru',
    destination: '',
    message: '',
    preferredVehicle: 'Toyota Innova Crysta',
  });

  const loadData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [sData, oData] = await Promise.all([
        getDashboardStats(),
        getDashboardOverview(period),
      ]);
      if (sData) setStats(sData);
      if (oData) setOverview(oData);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  // Close calendar popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleSelectQuickPeriod = (p) => {
    setPeriod(p);
    setSelectedDay(null);
    setCalendarDate(new Date());
  };

  const handleSelectDay = (dateObj) => {
    setSelectedDay(dateObj);
    setPeriod('today');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.phoneNumber) return;
    await createBooking(bookingForm);
    setIsBookingModalOpen(false);
    loadData();
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryForm.customerName || !enquiryForm.phoneNumber) return;
    await createEnquiry(enquiryForm);
    setIsEnquiryModalOpen(false);
    loadData();
  };

  const handleQuickVehicleStatus = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === 'available'
        ? 'on_trip'
        : currentStatus === 'on_trip'
        ? 'maintenance'
        : 'available';
    await updateVehicleStatus(id, nextStatus);
    loadData();
  };

  // Helper formatting functions
  const formatRefId = (ref) => {
    if (!ref) return '#BK1256';
    if (ref.startsWith('SKB-')) {
      const parts = ref.split('-');
      return `#BK${parts[parts.length - 1]}`;
    }
    return ref.replace('#BK-', '#BK');
  };

  const formatTripType = (trip, pkg) => {
    const raw = (pkg || trip || '').toLowerCase();
    if (raw.includes('airport')) return 'Airport Transfer';
    if (raw.includes('round') || raw.includes('outstation')) return 'Outstation Trip';
    if (raw.includes('8') && raw.includes('80')) return '8 Hours / 80 KM';
    if (raw.includes('4') && raw.includes('40')) return 'Local 4 Hours';
    if (raw.includes('drop') || raw.includes('oneway')) return 'Outstation Drop';
    if (raw.includes('group')) return 'Group Travel';
    return pkg || trip || 'Custom Trip';
  };

  const formatStatus = (s) => {
    const status = s ? s.toLowerCase() : 'new';
    if (status === 'enquiry_received') return { label: 'Enquiry', cls: 'enquiry_received' };
    if (status === 'confirmed') return { label: 'Confirmed', cls: 'confirmed' };
    if (status === 'pending') return { label: 'Pending', cls: 'pending' };
    if (status === 'completed') return { label: 'Completed', cls: 'completed' };
    if (status === 'cancelled') return { label: 'Cancelled', cls: 'cancelled' };
    if (status === 'contacted') return { label: 'Contacted', cls: 'contacted' };
    if (status === 'converted') return { label: 'Converted', cls: 'converted' };
    return { label: s || 'New', cls: status };
  };

  const todayDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const getBannerDateSubtitle = (p) => {
    const today = new Date();
    if (p === 'today') {
      return todayDateFormatted;
    }
    if (p === 'month') {
      return new Intl.DateTimeFormat('en-IN', {
        month: 'long',
        year: 'numeric',
      }).format(today);
    }
    // Default 'week'
    const firstDay = new Date(today);
    const dayOfWeek = today.getDay();
    const distanceToMon = (dayOfWeek + 6) % 7;
    firstDay.setDate(today.getDate() - distanceToMon);
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    return `${firstDay.getDate()} ${firstDay.toLocaleString('en-IN', { month: 'short' })} – ${lastDay.getDate()} ${lastDay.toLocaleString('en-IN', { month: 'short', year: 'numeric' })}`;
  };

  // Calendar Grid helper logic
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 for Sunday
  const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();
  const today = new Date();

  // Range for week calculation
  const getWeekRange = () => {
    const d = new Date(today);
    const dayOfWeek = d.getDay();
    const distanceToMon = (dayOfWeek + 6) % 7;
    const mon = new Date(d);
    mon.setDate(d.getDate() - distanceToMon);
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);
    return { start: mon, end: sun };
  };
  const weekRange = getWeekRange();

  const calendarCells = [];
  // 1. Prev month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      monthType: 'prev',
      date: new Date(calYear, calMonth - 1, daysInPrevMonth - i),
    });
  }
  // 2. Current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    calendarCells.push({
      day: i,
      monthType: 'current',
      date: new Date(calYear, calMonth, i),
    });
  }
  // 3. Next month leading days
  const remainingCells = 35 - calendarCells.length;
  const nextMonthCells = remainingCells >= 0 ? remainingCells : (42 - calendarCells.length);
  for (let i = 1; i <= nextMonthCells; i++) {
    calendarCells.push({
      day: i,
      monthType: 'next',
      date: new Date(calYear, calMonth + 1, i),
    });
  }

  return (
    <div className="admin-dashboard-page">
      {/* 1. Welcome Hero Banner matching attached screenshot */}
      <section className="admin-welcome-banner">
        {/* The single side Innova Crysta & temple backdrop with soft fade */}
        <div className="welcome-banner-backdrop-art" />

        <div className="welcome-banner-content">
          <h1 className="welcome-banner-heading">
            Welcome back, <span>Admin!</span>
          </h1>
          <p className="welcome-banner-sub">
            Manage your SKB Tour and Travels business bookings, enquiries, vehicles, packages and more.
          </p>

          <div className="banner-tagline-row">
            <span className="banner-cursive-tag">"Safe Journey Happy Memories"</span>
            <span className="banner-pin-dot">📍</span>
          </div>
        </div>

        <div className="welcome-banner-widgets" ref={calendarRef}>
          {/* Live Sync Badge & Refresh Action */}
          <div className="banner-sync-pill">
            <span className="sync-pulse-dot" />
            <span className="sync-text">{isRefreshing ? 'Syncing...' : `Live (${lastSyncTime})`}</span>
            <button
              type="button"
              onClick={() => loadData(true)}
              className={`btn-sync-refresh ${isRefreshing ? 'spin' : ''}`}
              title="Refresh live data from database"
            >
              <RotateCw size={13} />
            </button>
          </div>

          <div
            className={`banner-date-widget ${isCalendarOpen ? 'active' : ''}`}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            role="button"
            tabIndex={0}
            title="Click to view interactive calendar & filter dates"
          >
            <div className="banner-date-filter-wrap">
              <Calendar size={15} className="text-gold" />
              <span className="banner-period-label">
                {selectedDay
                  ? 'Selected Date'
                  : period === 'today'
                  ? 'Today'
                  : period === 'month'
                  ? 'This Month'
                  : 'This Week'}
              </span>
              {isCalendarOpen ? (
                <ChevronUp size={14} className="date-chevron" />
              ) : (
                <ChevronDown size={14} className="date-chevron" />
              )}
            </div>
            <div className="banner-date-day">
              {selectedDay
                ? new Intl.DateTimeFormat('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(selectedDay)
                : getBannerDateSubtitle(period)}
            </div>
          </div>

          {/* Interactive Calendar Dropdown Popup */}
          {isCalendarOpen && (
            <div className="admin-calendar-popup">
              {/* Presets Row */}
              <div className="calendar-presets-row">
                <button
                  type="button"
                  className={`calendar-preset-btn ${period === 'today' && !selectedDay ? 'active' : ''}`}
                  onClick={() => handleSelectQuickPeriod('today')}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`calendar-preset-btn ${period === 'week' ? 'active' : ''}`}
                  onClick={() => handleSelectQuickPeriod('week')}
                >
                  This Week
                </button>
                <button
                  type="button"
                  className={`calendar-preset-btn ${period === 'month' ? 'active' : ''}`}
                  onClick={() => handleSelectQuickPeriod('month')}
                >
                  This Month
                </button>
              </div>

              {/* Month Header with Prev/Next Controls */}
              <div className="calendar-month-header">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="cal-month-nav-btn"
                  title="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="cal-month-title">
                  {new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(calendarDate)}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="cal-month-nav-btn"
                  title="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day-of-week Headers */}
              <div className="calendar-weekdays-grid">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d} className="cal-weekday-label">{d}</span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="calendar-days-grid">
                {calendarCells.map((cell, idx) => {
                  const isCurrentCellMonth = cell.monthType === 'current';
                  const isTodayCell = cell.date.toDateString() === today.toDateString();

                  let isSelected = false;
                  let isInRange = false;

                  if (selectedDay) {
                    isSelected = cell.date.toDateString() === selectedDay.toDateString();
                  } else if (period === 'today') {
                    isSelected = isTodayCell;
                  } else if (period === 'week') {
                    const time = cell.date.getTime();
                    isInRange = time >= weekRange.start.getTime() && time <= weekRange.end.getTime();
                    isSelected = isTodayCell;
                  } else if (period === 'month') {
                    isInRange = isCurrentCellMonth;
                    isSelected = isTodayCell;
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDay(cell.date)}
                      className={`cal-day-cell ${cell.monthType} ${isTodayCell ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
                      title={cell.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    >
                      <span>{cell.day}</span>
                    </button>
                  );
                })}
              </div>

              {/* Footer info & close */}
              <div className="calendar-footer-bar">
                <div className="cal-footer-info">
                  <span className="cal-footer-dot" />
                  <span>
                    {selectedDay
                      ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(selectedDay)
                      : getBannerDateSubtitle(period)}
                  </span>
                </div>
                <button
                  type="button"
                  className="cal-apply-btn"
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Four KPI Stat Cards */}
      <section className="admin-stats-grid">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings?.value !== undefined ? String(stats.totalBookings.value) : '0'}
          growth={stats?.totalBookings?.growth ?? '+12%'}
          icon={Calendar}
          type="sparkline"
          sparklineColor="#E7B84D"
        />

        <StatCard
          title="Enquiries"
          value={stats?.enquiries?.value !== undefined ? String(stats.enquiries.value) : '0'}
          growth={stats?.enquiries?.growth ?? '+8%'}
          icon={Users}
          type="sparkline"
          sparklineColor="#3B82F6"
        />

        <StatCard
          title="Active Vehicles"
          value={stats?.activeVehicles?.value !== undefined ? String(stats.activeVehicles.value) : '0'}
          subMeta={`${stats?.activeVehicles?.available ?? 0} Available, ${stats?.activeVehicles?.onTrip ?? 0} On Trip`}
          icon={Car}
          type="circular"
          percentage={stats?.activeVehicles?.percentage ?? 100}
        />

        <StatCard
          title="Average Rating"
          value={stats?.averageRating?.value !== undefined ? String(stats.averageRating.value) : '5.0'}
          subtitle={`from ${stats?.averageRating?.reviewCount ?? 0} customer reviews`}
          icon={Star}
          type="stars"
        />
      </section>

      {/* 3. Middle Grid: Booking Overview & Quick Actions */}
      <section className="admin-middle-grid">
        {/* Left: Booking Overview Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="card-title-text">Booking Overview</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="card-filter-select"
            >
              <option value="week">This Week</option>
              <option value="today">Today</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="chart-legend-row">
            <div className="legend-item">
              <span className="legend-dot local" />
              <span>Local</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot outstation" />
              <span>Outstation</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot airport" />
              <span>Airport</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot others" />
              <span>Others</span>
            </div>
          </div>

          <div className="chart-bars-container">
            {(overview?.chartData || [
              { day: 'Mon', local: 7, outstation: 5, airport: 3, others: 3 },
              { day: 'Tue', local: 5, outstation: 4, airport: 2, others: 3 },
              { day: 'Wed', local: 9, outstation: 8, airport: 8, others: 6 },
              { day: 'Thu', local: 4, outstation: 6, airport: 2, others: 3 },
              { day: 'Fri', local: 6, outstation: 9, airport: 7, others: 4 },
              { day: 'Sat', local: 9, outstation: 10, airport: 6, others: 5 },
              { day: 'Sun', local: 11, outstation: 8, airport: 7, others: 7 },
            ]).map((item, idx) => {
              const maxVal = period === 'month' ? 80 : period === 'today' ? 24 : 36;
              const hLocal = Math.min(125, Math.max(6, (item.local / maxVal) * 125));
              const hOut = Math.min(125, Math.max(6, (item.outstation / maxVal) * 125));
              const hAirport = Math.min(125, Math.max(6, (item.airport / maxVal) * 125));
              const hOthers = Math.min(125, Math.max(6, (item.others / maxVal) * 125));

              return (
                <div key={idx} className="chart-bar-column">
                  <div className="bar-stack" title={`${item.day}: Local ${item.local}, Outstation ${item.outstation}, Airport ${item.airport}`}>
                    <div className="bar-segment local" style={{ height: `${hLocal}px` }} />
                    <div className="bar-segment outstation" style={{ height: `${hOut}px` }} />
                    <div className="bar-segment airport" style={{ height: `${hAirport}px` }} />
                    <div className="bar-segment others" style={{ height: `${hOthers}px` }} />
                  </div>
                  <span className="bar-label">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Actions (Gallery Removed, Clean 8 Actions) */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="card-title-text">Quick Actions</h2>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-link-action"
            >
              <span>View Website</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="quick-actions-grid">
            <button
              type="button"
              className="quick-action-tile"
              onClick={() => setIsBookingModalOpen(true)}
            >
              <div className="action-tile-icon">
                <Calendar size={20} />
              </div>
              <span className="action-tile-label">Add Booking</span>
            </button>

            <button
              type="button"
              className="quick-action-tile"
              onClick={() => setIsEnquiryModalOpen(true)}
            >
              <div className="action-tile-icon">
                <MessageSquare size={20} />
              </div>
              <span className="action-tile-label">Add Enquiry</span>
            </button>

            <Link to="/admin/packages" className="quick-action-tile">
              <div className="action-tile-icon">
                <Package size={20} />
              </div>
              <span className="action-tile-label">Add Package</span>
            </Link>

            <Link to="/admin/vehicles" className="quick-action-tile">
              <div className="action-tile-icon">
                <Car size={20} />
              </div>
              <span className="action-tile-label">Add Vehicle</span>
            </Link>

            <Link to="/admin/drivers" className="quick-action-tile">
              <div className="action-tile-icon">
                <UserCheck size={20} />
              </div>
              <span className="action-tile-label">Add Driver</span>
            </Link>

            <Link to="/admin/customers" className="quick-action-tile">
              <div className="action-tile-icon">
                <Users size={20} />
              </div>
              <span className="action-tile-label">Add Customer</span>
            </Link>

            <Link to="/admin/reports" className="quick-action-tile">
              <div className="action-tile-icon">
                <FileBarChart size={20} />
              </div>
              <span className="action-tile-label">View Reports</span>
            </Link>

            <Link to="/admin/settings" className="quick-action-tile">
              <div className="action-tile-icon">
                <Settings size={20} />
              </div>
              <span className="action-tile-label">Settings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Bottom Grid: Recent Bookings, Fleet Status, Recent Enquiries */}
      <section className="admin-bottom-grid">
        {/* Card 1: Recent Bookings */}
        <div className="admin-card recent-bookings-card">
          <div className="admin-card-header">
            <h2 className="card-title-text">Recent Bookings</h2>
            <Link to="/admin/bookings" className="card-link-action">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table dashboard-bookings-table">
              <thead>
                <tr>
                  <th style={{ width: 68 }}>#</th>
                  <th>Customer</th>
                  <th>Package</th>
                  <th style={{ width: 62 }}>Date</th>
                  <th style={{ width: 78 }}>Status</th>
                  <th style={{ width: 34, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(overview?.recentBookings || []).map((b) => {
                  const statusInfo = formatStatus(b.status);
                  return (
                    <tr key={b._id}>
                      <td
                        style={{ fontWeight: 800, color: '#334155', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                        title={b.bookingReference}
                      >
                        {formatRefId(b.bookingReference)}
                      </td>
                      <td>
                        <div className="table-customer-cell">
                          <div className="table-avatar-badge">
                            {b.fullName?.charAt(0) || 'C'}
                          </div>
                          <span className="table-customer-name" title={b.fullName}>
                            {b.fullName}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {formatTripType(b.tripType, b.packageName || b.tripTypeLabel)}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {b.travelDate
                          ? new Date(b.travelDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                          : 'Today'}
                      </td>
                      <td>
                        <span className={`status-pill ${statusInfo.cls}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setViewBooking(b)}
                          className="btn-icon-action"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Vehicle Fleet Status */}
        <div className="admin-card fleet-status-card">
          <div className="admin-card-header">
            <h2 className="card-title-text">Vehicle Fleet Status</h2>
            <Link to="/admin/vehicles" className="card-link-action">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="fleet-status-list">
            {(overview?.fleetStatus || []).map((v) => (
              <div key={v._id} className="fleet-status-row">
                <img
                  src={v.image || '/assets/images/card-innova.png'}
                  alt={v.name}
                  className="fleet-thumb-car"
                />

                <div className="fleet-titles-col">
                  <span className="fleet-car-name" title={v.name}>
                    {v.name}
                  </span>
                  <span className="fleet-plate-text">
                    {v.registrationNumber || 'KA 01 AB 1234'}
                  </span>
                </div>

                <div className="fleet-actions-col">
                  <span
                    className={`status-pill ${v.availabilityStatus || 'available'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleQuickVehicleStatus(v._id, v.availabilityStatus)}
                    title="Click to toggle status"
                  >
                    {v.availabilityStatus === 'on_trip'
                      ? 'On Trip'
                      : v.availabilityStatus === 'maintenance'
                      ? 'Maintenance'
                      : 'Available'}
                  </span>
                  <button
                    type="button"
                    className="btn-icon-action"
                    onClick={() => handleQuickVehicleStatus(v._id, v.availabilityStatus)}
                    title="Change status"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Recent Enquiries */}
        <div className="admin-card enquiries-status-card">
          <div className="admin-card-header">
            <h2 className="card-title-text">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="card-link-action">
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="recent-enquiries-list">
            {(overview?.recentEnquiries || []).map((e, idx) => {
              const avatarPalette = [
                { bg: 'linear-gradient(135deg, #1e293b, #475569)', color: '#ffffff' },
                { bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#92400e' },
                { bg: 'linear-gradient(135deg, #dbeafe, #93c5fd)', color: '#1e40af' },
                { bg: 'linear-gradient(135deg, #fef08a, #facc15)', color: '#854d0e' },
                { bg: 'linear-gradient(135deg, #f3e8ff, #d8b4fe)', color: '#6b21a8' },
              ][idx % 5];

              const status = (e.status || 'new').toLowerCase();
              const statusLabel =
                status === 'converted' ? 'Converted' : status === 'contacted' ? 'Contacted' : 'New';

              return (
                <div
                  key={e._id}
                  className="enquiry-row-item"
                  onClick={() => setViewEnquiry(e)}
                >
                  <div
                    className="item-avatar-user"
                    style={{ background: avatarPalette.bg, color: avatarPalette.color }}
                  >
                    {e.customerName?.charAt(0) || 'E'}
                  </div>

                  <div className="enquiry-titles-col">
                    <span className="enquiry-customer-name" title={e.customerName}>
                      {e.customerName}
                    </span>
                    <span className="enquiry-trip-sub" title={e.tripType}>
                      {formatTripType(e.tripType)}
                    </span>
                  </div>

                  <div className="enquiry-meta-right">
                    <span className="enquiry-time-text">
                      {e.timeAgo || 'Just now'}
                    </span>
                    <span className={`status-pill ${status}`}>
                      {statusLabel}
                    </span>
                    <button
                      type="button"
                      className="btn-icon-action mini btn-whatsapp-direct"
                      onClick={(evt) => {
                        evt.stopPropagation();
                        const phone = (e.phoneNumber || '').replace(/\D/g, '');
                        const clean = phone.length === 10 ? `91${phone}` : phone;
                        const msg = `Hello ${e.customerName || 'Customer'}, regarding your travel enquiry with SKB Tour and Travels. How may we assist you?`;
                        window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      title={`Chat with ${e.customerName} on WhatsApp`}
                    >
                      <MessageSquare size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon-action mini"
                      onClick={(evt) => {
                        evt.stopPropagation();
                        setViewEnquiry(e);
                      }}
                      title="View details"
                    >
                      <MoreVertical size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Add Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Create New Booking"
        footer={
          <>
            <button type="button" className="btn-admin-secondary" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn-admin-primary" onClick={handleBookingSubmit}>
              Save Booking
            </button>
          </>
        }
      >
        <form onSubmit={handleBookingSubmit}>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Customer Name *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Full Name"
                value={bookingForm.fullName}
                onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone Number *</label>
              <input
                type="tel"
                className="admin-form-input"
                placeholder="10-digit mobile"
                value={bookingForm.phoneNumber}
                onChange={(e) => setBookingForm({ ...bookingForm, phoneNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Trip Type</label>
              <select
                className="admin-form-select"
                value={bookingForm.tripType}
                onChange={(e) => setBookingForm({ ...bookingForm, tripType: e.target.value })}
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
              <label className="admin-form-label">Preferred Vehicle</label>
              <select
                className="admin-form-select"
                value={bookingForm.preferredVehicle}
                onChange={(e) => setBookingForm({ ...bookingForm, preferredVehicle: e.target.value })}
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
                placeholder="Pickup address"
                value={bookingForm.pickupLocation}
                onChange={(e) => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Destination *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Destination address"
                value={bookingForm.destination}
                onChange={(e) => setBookingForm({ ...bookingForm, destination: e.target.value })}
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
                value={bookingForm.travelDate}
                onChange={(e) => setBookingForm({ ...bookingForm, travelDate: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Estimated / Agreed Fare (₹)</label>
              <input
                type="number"
                className="admin-form-input"
                placeholder="e.g. 1900"
                value={bookingForm.estimatedFare}
                onChange={(e) => setBookingForm({ ...bookingForm, estimatedFare: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Quick Add Enquiry Modal */}
      <Modal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        title="Add Customer Enquiry"
        footer={
          <>
            <button type="button" className="btn-admin-secondary" onClick={() => setIsEnquiryModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn-admin-primary" onClick={handleEnquirySubmit}>
              Save Enquiry
            </button>
          </>
        }
      >
        <form onSubmit={handleEnquirySubmit}>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Customer Name *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Customer Name"
                value={enquiryForm.customerName}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, customerName: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone Number *</label>
              <input
                type="tel"
                className="admin-form-input"
                placeholder="10-digit mobile"
                value={enquiryForm.phoneNumber}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, phoneNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Trip Type</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="e.g. Airport Transfer, Outstation"
                value={enquiryForm.tripType}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, tripType: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Destination</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Destination"
                value={enquiryForm.destination}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, destination: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Enquiry Notes / Requirements</label>
            <textarea
              className="admin-form-textarea"
              rows={3}
              placeholder="Customer travel details, specific dates, vehicle requests..."
              value={enquiryForm.message}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* View Booking Details Modal */}
      {viewBooking && (
        <Modal
          isOpen={!!viewBooking}
          onClose={() => setViewBooking(null)}
          title={`Booking Details — ${viewBooking.bookingReference || '#BK'}`}
          footer={
            <button type="button" className="btn-admin-primary" onClick={() => setViewBooking(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>CUSTOMER</strong>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: 2 }}>{viewBooking.fullName}</div>
              <div style={{ color: '#0369a1' }}>{viewBooking.phoneNumber}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>STATUS</strong>
              <span className={`status-pill ${formatStatus(viewBooking.status).cls}`} style={{ marginTop: 4 }}>
                {formatStatus(viewBooking.status).label}
              </span>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>TRIP TYPE</strong>
              <div>{formatTripType(viewBooking.tripType, viewBooking.packageName || viewBooking.tripTypeLabel)}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>TRAVEL DATE</strong>
              <div>{viewBooking.travelDate ? new Date(viewBooking.travelDate).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>PICKUP</strong>
              <div>{viewBooking.pickupLocation}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>DESTINATION</strong>
              <div>{viewBooking.destination}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>VEHICLE</strong>
              <div>{viewBooking.preferredVehicle}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>RECORDED FARE</strong>
              <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>
                ₹{viewBooking.finalFare || viewBooking.estimatedFare || 'Pending Quote'}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* View Enquiry Details Modal */}
      {viewEnquiry && (
        <Modal
          isOpen={!!viewEnquiry}
          onClose={() => setViewEnquiry(null)}
          title={`Enquiry — ${viewEnquiry.customerName}`}
          footer={
            <button type="button" className="btn-admin-primary" onClick={() => setViewEnquiry(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>PHONE</strong>
              <a href={`tel:${viewEnquiry.phoneNumber}`} style={{ fontWeight: 700, color: '#0369a1' }}>
                {viewEnquiry.phoneNumber}
              </a>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>TRIP TYPE</strong>
              <div>{viewEnquiry.tripType}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>DESTINATION</strong>
              <div>{viewEnquiry.destination || 'Not specified'}</div>
            </div>
            <div>
              <strong style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>MESSAGE</strong>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                {viewEnquiry.message || 'No additional message provided.'}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
