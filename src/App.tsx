import React, { useState, useEffect } from 'react';
import { User, LanguageCode, UserRole } from './types';
import { getCurrentUser } from './lib/storage';
import { Navbar } from './components/Navbar';
import { DashboardNavbar } from './components/DashboardNavbar';
import { Footer } from './components/Footer';
import { DashboardFooter } from './components/DashboardFooter';
import { OfflineIndicator } from './components/PWAInstallModal';
import { LoginPage } from './pages/auth/LoginPage';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PortfolioPage } from './pages/public/PortfolioPage';
import { EstimatorPage } from './pages/public/EstimatorPage';
import { BlogPage } from './pages/public/BlogPage';
import { TestimonialsPage } from './pages/public/TestimonialsPage';
import { ContactPage } from './pages/public/ContactPage';
import { SystemGuidePage } from './pages/public/SystemGuidePage';

// Portal Views
import { ClientPortalLayout } from './pages/portal/ClientPortalLayout';
import { ClientProjectsView } from './pages/portal/ClientProjectsView';
import { ClientChatView } from './pages/portal/ClientChatView';
import { ClientInvoicesView } from './pages/portal/ClientInvoicesView';
import { ClientContractsView } from './pages/portal/ClientContractsView';
import { ClientSupportView } from './pages/portal/ClientSupportView';

// Admin Views
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverviewView } from './pages/admin/AdminOverviewView';
import { CentralizedAuditLogView } from './pages/admin/CentralizedAuditLogView';
import { SystemHealthAndScalingView } from './pages/admin/SystemHealthAndScalingView';
import { ApiManagementView } from './pages/admin/ApiManagementView';
import { EstimatorRulesManagerView } from './pages/admin/EstimatorRulesManagerView';
import { AdminLeadsView } from './pages/admin/AdminLeadsView';
import { AdminSupportDeskView } from './pages/admin/AdminSupportDeskView';
import { AdminTeamManagementView } from './pages/admin/AdminTeamManagementView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname.startsWith('/portal') || window.location.pathname.startsWith('/admin')
      ? window.location.pathname
      : '/';
  });
  const [currentLang, setCurrentLang] = useState<LanguageCode>('id');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [prefilledLoginRole, setPrefilledLoginRole] = useState<UserRole | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());

  // Portal sub-tabs
  const [portalSubTab, setPortalSubTab] = useState<'overview' | 'chat' | 'invoices' | 'contracts' | 'support' | 'files'>('overview');

  // Admin sub-tabs
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'audit-log' | 'system-health' | 'api' | 'estimator-rules' | 'leads' | 'support' | 'team'>('overview');

  useEffect(() => {
    const handleStorageUpdate = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('nexa_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('nexa_storage_update', handleStorageUpdate);
  }, []);

  const handleNavigate = (path: string) => {
    // Route protection: check if protected route
    if (path.startsWith('/portal')) {
      if (!currentUser) {
        setPrefilledLoginRole('client');
        setShowLoginModal(true);
        return;
      }
      if (path === '/portal/invoice') setPortalSubTab('invoices');
      else if (path === '/portal/support') setPortalSubTab('support');
      else if (path === '/portal/chat') setPortalSubTab('chat');
      else if (path === '/portal/contracts') setPortalSubTab('contracts');
      else setPortalSubTab('overview');
    }

    if (path.startsWith('/admin')) {
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'superadmin' && currentUser.role !== 'staff')) {
        setPrefilledLoginRole('admin');
        setShowLoginModal(true);
        return;
      }
      if (path === '/admin/team') setAdminSubTab('team');
      else if (path === '/admin/activity-log') setAdminSubTab('audit-log');
      else if (path === '/admin/system-health') setAdminSubTab('system-health');
      else if (path === '/admin/api') setAdminSubTab('api');
      else if (path === '/admin/estimator-rules') setAdminSubTab('estimator-rules');
      else if (path === '/admin/leads') setAdminSubTab('leads');
      else if (path === '/admin/support') setAdminSubTab('support');
      else setAdminSubTab('overview');
    }

    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = (role?: UserRole) => {
    setPrefilledLoginRole(role);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    if (user.role === 'admin' || user.role === 'superadmin' || user.role === 'staff') {
      setCurrentPath('/admin');
    } else {
      setCurrentPath('/portal');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Offline Connectivity Toast */}
      <OfflineIndicator />

      {/* Navigation Bar: DashboardNavbar for Portal & Admin, Navbar for Public */}
      {(currentPath.startsWith('/portal') || currentPath.startsWith('/admin')) ? (
        <DashboardNavbar
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />
      ) : (
        <Navbar
          currentPath={currentPath}
          onNavigate={handleNavigate}
          currentLang={currentLang}
          onLangChange={setCurrentLang}
          onOpenLogin={handleOpenLogin}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* PUBLIC ROUTES */}
        {currentPath === '/' && (
          <HomePage onNavigate={handleNavigate} currentLang={currentLang} />
        )}
        {currentPath === '/layanan' && (
          <ServicesPage onNavigate={handleNavigate} />
        )}
        {currentPath === '/portfolio' && (
          <PortfolioPage onNavigate={handleNavigate} />
        )}
        {currentPath === '/estimasi' && (
          <EstimatorPage onNavigate={handleNavigate} currentLang={currentLang} />
        )}
        {currentPath === '/blog' && (
          <BlogPage onNavigate={handleNavigate} />
        )}
        {currentPath === '/testimoni' && (
          <TestimonialsPage onNavigate={handleNavigate} />
        )}
        {currentPath === '/kontak' && (
          <ContactPage onNavigate={handleNavigate} />
        )}
        {(currentPath === '/panduan' || currentPath === '/dokumentasi') && (
          <SystemGuidePage onNavigate={handleNavigate} onOpenLogin={handleOpenLogin} />
        )}

        {/* CLIENT PORTAL ROUTES */}
        {currentPath.startsWith('/portal') && (
          <ClientPortalLayout
            currentSubTab={portalSubTab}
            onSubTabChange={(tab) => {
              setPortalSubTab(tab);
              if (tab === 'overview') setCurrentPath('/portal');
              else setCurrentPath(`/portal/${tab}`);
            }}
          >
            {portalSubTab === 'overview' && <ClientProjectsView />}
            {portalSubTab === 'chat' && <ClientChatView />}
            {portalSubTab === 'invoices' && <ClientInvoicesView />}
            {portalSubTab === 'contracts' && <ClientContractsView />}
            {portalSubTab === 'support' && <ClientSupportView />}
          </ClientPortalLayout>
        )}

        {/* ADMIN CMS ROUTES */}
        {currentPath.startsWith('/admin') && (
          <AdminLayout
            currentAdminTab={adminSubTab}
            onAdminTabChange={(tab) => {
              setAdminSubTab(tab);
              if (tab === 'overview') setCurrentPath('/admin');
              else setCurrentPath(`/admin/${tab}`);
            }}
          >
            {adminSubTab === 'overview' && <AdminOverviewView onNavigateTab={setAdminSubTab} />}
            {adminSubTab === 'team' && <AdminTeamManagementView />}
            {adminSubTab === 'audit-log' && <CentralizedAuditLogView />}
            {adminSubTab === 'system-health' && <SystemHealthAndScalingView />}
            {adminSubTab === 'api' && <ApiManagementView />}
            {adminSubTab === 'estimator-rules' && <EstimatorRulesManagerView />}
            {adminSubTab === 'leads' && <AdminLeadsView />}
            {adminSubTab === 'support' && <AdminSupportDeskView />}
          </AdminLayout>
        )}
      </main>

      {/* Footer: Clean lightweight footer on Dashboards, full marketing footer on Public pages */}
      {(currentPath.startsWith('/portal') || currentPath.startsWith('/admin')) ? (
        <DashboardFooter onNavigate={handleNavigate} />
      ) : (
        <Footer onNavigate={handleNavigate} currentLang={currentLang} />
      )}

      {/* Login & 2FA Modal */}
      {showLoginModal && (
        <LoginPage
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          prefilledRole={prefilledLoginRole}
        />
      )}
    </div>
  );
}
