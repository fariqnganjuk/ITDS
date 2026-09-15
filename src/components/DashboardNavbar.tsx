import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  LogOut,
  Bell,
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { User as UserType } from '../types';
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../lib/storage';

interface DashboardNavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  currentPath,
  onNavigate
}) => {
  const [user, setUser] = useState<UserType | null>(getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setUser(getCurrentUser());
      setNotifications(getNotifications());
    };
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isAdminView = currentPath.startsWith('/admin');
  const allUsers = getUsers();

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setShowUserMenu(false);
    onNavigate('/');
  };

  const handleSwitchAccount = (targetEmail: string) => {
    const target = allUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    if (target) {
      setCurrentUser(target);
      setUser(target);
      setShowUserMenu(false);
      if (target.role === 'admin' || target.role === 'superadmin' || target.role === 'staff') {
        onNavigate('/admin');
      } else {
        onNavigate('/portal');
      }
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'superadmin':
        return { text: 'Super Admin', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'admin':
        return { text: 'Admin', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'staff':
        return { text: 'Tim Spesialis', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'client':
      default:
        return { text: 'Klien Terverifikasi', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <header
      id="dashboard-navbar"
      className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Branding & Context Mode */}
          <div className="flex items-center space-x-4">
            <button
              id="dash-brand-btn"
              onClick={() => onNavigate(isAdminView ? '/admin' : '/portal')}
              className="flex items-center space-x-3 group focus:outline-none"
              title="Kembali ke Dashboard Utama"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-black tracking-tight text-white text-base">NEXA</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {isAdminView ? 'Admin Console' : 'Client Portal'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 -mt-0.5 font-mono">
                  {isAdminView ? 'Enterprise Management' : 'Project Workspace'}
                </p>
              </div>
            </button>

            {/* Quick Context Switcher Pill (if user has admin rights) */}
            {user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'staff') && (
              <div className="hidden md:flex items-center pl-4 border-l border-slate-800/70 space-x-1">
                <button
                  id="nav-to-admin-btn"
                  onClick={() => onNavigate('/admin')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                    isAdminView
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  id="nav-to-portal-btn"
                  onClick={() => onNavigate('/portal')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all flex items-center space-x-1.5 ${
                    !isAdminView
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Klien</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Actions, Notifications, User Profile & Simple Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Public Website Link */}
            <button
              id="dash-view-public-site"
              onClick={() => onNavigate('/')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Buka Website Publik"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifMenuRef}>
              <button
                id="dash-notif-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-sky-500 text-[10px] font-bold rounded-full flex items-center justify-center text-white ring-2 ring-slate-950 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl p-4 backdrop-blur-xl z-50 text-slate-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-sky-400" />
                      <h4 className="text-sm font-semibold text-white">Notifikasi Aktivitas</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          markAllNotificationsRead();
                          setNotifications(getNotifications());
                        }}
                        className="text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
                      >
                        Tandai Semua Dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        Tidak ada notifikasi baru.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setNotifications(getNotifications());
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                            n.isRead ? 'text-slate-400 hover:bg-slate-800/40' : 'bg-sky-500/10 text-slate-200 hover:bg-sky-500/15 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="dash-user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center ring-1 ring-sky-500/30">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono leading-none">
                      {roleInfo.text}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl p-3 backdrop-blur-xl z-50 text-slate-200 divide-y divide-slate-800/60">
                    {/* User Profile Summary */}
                    <div className="pb-3 px-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white truncate max-w-[180px]">{user.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${roleInfo.color}`}>
                          {roleInfo.text}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                      {user.title && (
                        <p className="text-[11px] text-sky-400 font-medium mt-0.5">
                          {user.title}
                        </p>
                      )}
                      <div className="flex items-center space-x-1 mt-2 text-[10px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>2FA Aktif & Sesi Terenkripsi</span>
                      </div>
                    </div>

                    {/* Quick Demo Switcher Section */}
                    <div className="py-2.5 px-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
                        <span className="flex items-center space-x-1.5">
                          <ArrowRightLeft className="w-3 h-3 text-sky-400" />
                          <span>Ganti Akun Demo</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">1-Klik</span>
                      </div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {allUsers.map((u) => {
                          const isCurrent = u.id === user.id;
                          return (
                            <button
                              key={u.id}
                              onClick={() => handleSwitchAccount(u.email)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                isCurrent
                                  ? 'bg-sky-500/20 text-sky-300 font-semibold'
                                  : 'text-slate-300 hover:bg-slate-800/80'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <p className="leading-tight">{u.name}</p>
                                <p className="text-[10px] text-slate-400">{u.title || u.role}</p>
                              </div>
                              {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Logout Action in dropdown */}
                    <div className="pt-2 px-1">
                      <button
                        id="dash-menu-logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all border border-rose-500/20"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="dash-guest-login-btn"
                onClick={() => onNavigate('/')}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              >
                Kembali ke Beranda
              </button>
            )}

            {/* Simple Direct Logout Button (High Visibility) */}
            {user && (
              <button
                id="dash-direct-logout-btn"
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-400 bg-slate-900/80 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all"
                title="Keluar dari sesi saat ini"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
