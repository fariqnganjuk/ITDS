import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Bell,
  Menu,
  X,
  Globe,
  UserCheck,
  LogOut,
  ChevronDown,
  Lock,
  LayoutDashboard,
  Layers,
  Key,
  ExternalLink,
  Compass,
  ArrowRightLeft,
  Sparkles,
  Users
} from 'lucide-react';
import { User, LanguageCode } from '../types';
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../lib/storage';
import { DICTIONARY } from '../lib/i18n';
import { PWAInstallButton } from './PWAInstallModal';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  currentLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  onOpenLogin: (prefilledRole?: User['role']) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  currentLang,
  onLangChange,
  onOpenLogin
}) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());

  const t = DICTIONARY[currentLang].nav;

  useEffect(() => {
    const handleUpdate = () => {
      setUser(getCurrentUser());
      setNotifications(getNotifications());
    };
    window.addEventListener('nexa_storage_update', handleUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleUpdate);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setShowUserMenu(false);
    onNavigate('/');
  };

  const allUsers = getUsers();

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

  const navLinks = [
    { label: t.home, path: '/' },
    { label: t.services, path: '/layanan' },
    { label: t.portfolio, path: '/portfolio' },
    { label: t.estimator, path: '/estimasi', highlight: true },
    { label: t.blog, path: '/blog' },
    { label: t.testimonials, path: '/testimoni' },
    { label: t.contact, path: '/kontak' },
    { label: 'Panduan Alur', path: '/panduan' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 group text-left shrink-0"
          id="btn-brand-home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-sky-400 transition">
                NEXA
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Agency
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Moon Interactive Solution</span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navLinks.map(link => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`px-3 py-1.5 rounded-lg transition text-xs xl:text-sm ${
                  isActive
                    ? 'text-white bg-slate-800 font-semibold shadow-sm'
                    : link.highlight
                    ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* PWA Install Button */}
          <PWAInstallButton className="hidden sm:flex" />

          {/* Language Switcher */}
          <div className="relative group">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer transition">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="uppercase font-semibold">{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="absolute right-0 mt-1 w-28 rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-xl hidden group-hover:block z-50">
              <button
                onClick={() => onLangChange('id')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  currentLang === 'id' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🇮🇩 ID</span>
                <span className="text-[10px] opacity-75">Indo</span>
              </button>
              <button
                onClick={() => onLangChange('en')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  currentLang === 'en' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🇬🇧 EN</span>
                <span className="text-[10px] opacity-75">Eng</span>
              </button>
              <button
                onClick={() => onLangChange('my')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                  currentLang === 'my' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🇲🇾 MY</span>
                <span className="text-[10px] opacity-75">Melayu</span>
              </button>
            </div>
          </div>

          {/* Notifications Flyout */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              id="btn-nav-notifications"
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-950 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Pusat Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-semibold">
                        {unreadCount} Baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        markAllNotificationsRead();
                        setNotifications(getNotifications());
                      }}
                      className="text-[11px] text-sky-400 hover:underline font-medium"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">Belum ada notifikasi baru.</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifications(getNotifications());
                          if (n.link) {
                            onNavigate(n.link);
                            setShowNotifications(false);
                          }
                        }}
                        className={`py-2.5 px-2 rounded-lg cursor-pointer transition ${
                          !n.isRead ? 'bg-sky-950/30 hover:bg-sky-900/40' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="btn-user-profile-menu"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white truncate max-w-[110px] leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-sky-400 uppercase font-medium">
                    <span>{user.role}</span>
                    {user.twoFaEnabled && <Lock className="w-2.5 h-2.5 text-emerald-400" />}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs animate-scaleUp">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <div className="font-bold text-white text-sm">{user.name}</div>
                    <div className="text-slate-400 text-[11px] truncate">{user.email}</div>
                    {user.title && (
                      <div className="text-[10px] text-sky-400 font-medium mt-0.5">{user.title}</div>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                      <UserCheck className="w-3 h-3" />
                      <span>Role: {user.role.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Navigation within workspace */}
                  {(user.role === 'client' || user.role === 'staff' || user.role === 'admin' || user.role === 'superadmin') && (
                    <button
                      onClick={() => {
                        onNavigate('/portal');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-sky-400" />
                      <span>Client Portal</span>
                    </button>
                  )}

                  {(user.role === 'staff' || user.role === 'admin' || user.role === 'superadmin') && (
                    <button
                      onClick={() => {
                        onNavigate('/admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      <span>Pusat Kendali Admin CMS</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onNavigate('/portal/support');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Meja Bantuan & 2FA</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('/panduan');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-sky-400" />
                    <span>Panduan Alur Sistem</span>
                  </button>

                  {/* Quick Role / Team Switcher */}
                  <div className="pt-2 mt-2 border-t border-slate-800">
                    <div className="px-2 py-1 text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Ganti Akun Demo / Tim:
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-1">
                      <button
                        onClick={() => handleSwitchAccount('fariqnganjuk@gmail.com')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] flex items-center justify-between transition"
                      >
                        <span className="font-semibold text-white">Ahmad Fariq</span>
                        <span className="text-[9px] text-purple-400">Full Stack (Super)</span>
                      </button>
                      <button
                        onClick={() => handleSwitchAccount('faizin@nexa.agency')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] flex items-center justify-between transition"
                      >
                        <span className="font-semibold text-white">Faizin</span>
                        <span className="text-[9px] text-purple-400">Super Admin</span>
                      </button>
                      <button
                        onClick={() => handleSwitchAccount('ilham@nexa.agency')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] flex items-center justify-between transition"
                      >
                        <span className="font-semibold text-white">Ilham</span>
                        <span className="text-[9px] text-emerald-400">System Analyst</span>
                      </button>
                      <button
                        onClick={() => handleSwitchAccount('miftah@nexa.agency')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] flex items-center justify-between transition"
                      >
                        <span className="font-semibold text-white">Miftah</span>
                        <span className="text-[9px] text-blue-400">IT Infra & Support</span>
                      </button>
                      <button
                        onClick={() => handleSwitchAccount('toni@nexa.agency')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] flex items-center justify-between transition"
                      >
                        <span className="font-semibold text-white">Toni</span>
                        <span className="text-[9px] text-amber-400">Enterprise UI/UX</span>
                      </button>
                      <button
                        onClick={() => handleSwitchAccount('client@fintech.co.id')}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] flex items-center justify-between transition"
                      >
                        <span className="font-semibold text-white">Budi Santoso</span>
                        <span className="text-[9px] text-sky-400">Klien Fintech</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenLogin()}
                id="btn-login-open"
                className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition active:scale-95 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-2 text-sm font-medium">
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => {
                onNavigate(link.path);
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-3.5 py-2 rounded-xl transition ${
                currentPath === link.path
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <PWAInstallButton />
            {user ? (
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 font-semibold px-3 py-1.5 rounded-lg bg-rose-500/10"
              >
                {t.logout}
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenLogin();
                }}
                className="text-xs text-sky-400 font-semibold px-3 py-1.5 rounded-lg bg-sky-500/10"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
