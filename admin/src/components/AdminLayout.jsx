import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Car, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Layers, 
  Settings, 
  Activity, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLayout() {
  const { admin, logout, darkMode, toggleTheme, notifications } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Trimmed to strictly support the 5 public pages
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/bookings', icon: CalendarDays },
    { name: 'Enquiries & Chat', path: '/enquiries', icon: MessageSquare },
    { name: 'Fleet Manager', path: '/vehicles', icon: Car },
    { name: 'Drivers Manager', path: '/drivers', icon: Users },
    { name: 'Services Manager', path: '/services', icon: Layers },
    { name: 'Content Manager', path: '/content', icon: Sparkles },
    { name: 'Website Settings', path: '/settings', icon: Settings },
    { name: 'Users & Activity Log', path: '/logs', icon: Activity }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-navy text-softWhite flex overflow-x-hidden">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className={`admin-sidebar hidden md:flex flex-col justify-between border-r transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        <div>
          {/* Logo & Collapse button */}
          <div className="admin-sidebar-brand p-5 border-b flex items-center justify-between">
            <Link to="/dashboard" className={`rounded-lg bg-white p-1 ${collapsed ? 'mx-auto' : ''}`}>
              <img
                src="/images/orange-cabs-premium-logo.png"
                alt="Orange Cabs"
                className={`object-contain ${collapsed ? 'h-8 w-12' : 'h-11 w-40'}`}
              />
              </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg glass text-gray-400 hover:text-white transition-colors mx-auto"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={collapsed ? item.name : ''}
                  className={`admin-sidebar-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive(item.path)
                      ? 'admin-sidebar-link-active font-bold'
                      : ''
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="admin-sidebar-brand p-4 border-t">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="admin-sidebar-avatar w-8 h-8 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="truncate">
                  <p className="admin-sidebar-name text-xs font-bold truncate">{admin?.name || 'Admin User'}</p>
                  <p className="admin-sidebar-role text-[10px] capitalize">{admin?.role || 'Super Admin'}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full py-2 flex items-center justify-center text-gray-400 hover:text-red-400"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/10 glass px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl glass text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-gray-400 hidden sm:inline">
              Orange Cab Corporate Management Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Live Website Button */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass hover:border-orange/50 text-xs font-semibold text-gray-300 hover:text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-orange" />
              <span>Public Site</span>
            </a>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass text-gray-300 hover:text-orange transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl glass text-gray-300 hover:text-orange transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {notifications?.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange animate-ping" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card border border-white/10 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white">Live Dispatch Alerts</span>
                    <span className="text-[10px] text-orange">Real-Time (Socket.io)</span>
                  </div>
                  {notifications?.length === 0 ? (
                    <p className="text-xs text-gray-400 py-3 text-center">No new alerts.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n, i) => (
                        <div key={i} className="p-2 rounded-lg bg-navy/60 text-xs text-gray-200">
                          <p className="font-semibold text-orange">{n.title || 'New Booking'}</p>
                          <p className="text-[11px] text-gray-300">{n.message || n.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-lg bg-orange/20 border border-orange/40 text-orange font-bold text-xs flex items-center justify-center">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-xs font-semibold text-white hidden md:inline">
                {admin?.name || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-navy/80 backdrop-blur-md flex">
            <div className="admin-sidebar w-64 p-5 flex flex-col justify-between border-r">
              <div>
                <div className="admin-sidebar-brand flex items-center justify-between pb-4 border-b mb-4">
                  <img
                    src="/images/orange-cabs-premium-logo.png"
                    alt="Orange Cabs"
                    className="h-10 w-36 rounded-md bg-white p-1 object-contain"
                  />
                  <button onClick={() => setMobileOpen(false)} className="text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`admin-sidebar-link flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive(item.path) ? 'admin-sidebar-link-active' : ''
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Main Routed Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
