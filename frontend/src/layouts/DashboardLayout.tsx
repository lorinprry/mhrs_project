import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartPulse, LayoutDashboard, Search, CalendarDays,
  Heart, UserCircle, LogOut, Menu, X, Bell, ShieldCheck,
  Stethoscope, FileText, Activity, ChevronRight, Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

/* ─── Inline styles updated for CSS Variables ─── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .dash-root { display:flex; min-height:100vh; background:var(--bg-primary); font-family:'Plus Jakarta Sans',sans-serif; color:var(--text-main); transition:all 0.3s; }

  /* ── SIDEBAR ── */
  .sidebar {
    width:272px; min-height:100vh; background:var(--bg-card);
    border-right:1px solid var(--border-color);
    display:flex; flex-direction:column;
    position:sticky; top:0; height:100vh; overflow-y:auto;
    flex-shrink:0;
    box-shadow: var(--shadow-sm);
  }

  .sb-brand {
    display:flex; align-items:center; gap:12px;
    padding:1.75rem 1.5rem 1.25rem;
    border-bottom:1px solid var(--border-color);
  }
  .sb-brand-icon {
    width:40px; height:40px; border-radius:12px;
    background:linear-gradient(135deg,#6366f1,#7c3aed);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 12px rgba(99,102,241,0.3); flex-shrink:0;
  }
  .sb-brand-name { font-family:'Outfit',sans-serif; font-size:1.25rem; font-weight:800; letter-spacing:-0.5px; color:var(--text-main); }
  .sb-brand-badge {
    font-size:9px; font-weight:700; letter-spacing:1px;
    background:linear-gradient(135deg,#6366f1,#7c3aed); color:white;
    padding:2px 7px; border-radius:999px; text-transform:uppercase;
  }

  /* User card */
  .sb-user {
    margin: 1rem 1.25rem;
    background: var(--bg-soft);
    border: 1px solid var(--border-color); border-radius: 16px;
    padding: 1rem 1.1rem;
    display: flex; flex-direction: column; gap: 4px;
    box-shadow: var(--shadow-sm);
  }
  .sb-user-row { display: flex; align-items: center; gap: 10px; }
  .sb-user-avatar {
    width: 42px; height: 42px; border-radius: 12px;
    object-fit: cover; border: 2px solid white;
    box-shadow: 0 4px 12px rgba(99,102,241,0.15);
    flex-shrink: 0;
  }
  .sb-user-name { font-size: .875rem; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sb-user-role { font-size: .7rem; color: var(--primary-color); font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
  
  .sb-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: .875rem 1rem; border-radius: 14px;
    font-size: .875rem; font-weight: 600; color: var(--text-secondary);
    background: transparent; border: none; cursor: pointer;
    transition: all .2s ease; text-align: left; width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .sb-nav-item:hover { background: var(--bg-soft); color: var(--primary-color); }
  .sb-nav-item.active { background: var(--primary-color); color: white; font-weight: 800; box-shadow: 0 4px 12px rgba(99,102,241,0.2); }

  /* TOP BAR */
  .dash-topbar {
    position:sticky; top:0; z-index:30;
    background:var(--bg-primary); backdrop-filter:blur(12px);
    border-bottom:1px solid var(--border-color);
    padding:0 2rem; height:68px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .topbar-breadcrumb { font-size:.95rem; font-weight:800; color:#1e293b; letter-spacing: -0.2px; }
  .topbar-breadcrumb-current { color:var(--primary-color); font-weight:900; }
  .topbar-actions { display:flex; align-items:center; gap:16px; }
  .topbar-notif-btn {
    width:38px; height:38px; border-radius:10px;
    background:var(--bg-card); border:1px solid var(--border-color);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all .2s; position:relative;
  }
  .topbar-date { font-size:.8rem; font-weight:600; color:var(--text-secondary); background:var(--bg-card); padding:.4rem .9rem; border-radius:8px; border:1px solid var(--border-color); }

  .dash-main { flex: 1; min-width: 0; display: flex; flex-direction: column; background: var(--bg-primary); }
  .dash-content { flex: 1; padding: 1.5rem 2rem; width: 100%; box-sizing: border-box; }
`;

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, theme } = useSettings();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDoctor = user?.role === 'doctor';
  
  const PatientNavItems = [
    { path: '/patient',      label: t.dashboard,    icon: LayoutDashboard,  badge: null },
    { path: '/doctors',     label: t.doctors,      icon: Search,            badge: null },
    { path: '/booking',     label: t.booking,      icon: CalendarDays,      badge: 'Hızlı' },
    { path: '/appointments',label: t.appointments, icon: FileText,          badge: null },
    { path: '/favorites',   label: t.favorites,    icon: Heart,             badge: null },
  ];

  const DoctorNavItems = [
    { path: '/doctor',       label: t.dashboard,       icon: LayoutDashboard, badge: null },
    { path: '/appointments', label: t.appointments,    icon: CalendarDays,    badge: null },
    { path: '/profile',      label: t.profile,         icon: Stethoscope,     badge: null },
  ];

  const navItems = isDoctor ? DoctorNavItems : PatientNavItems;

  const handleLogout = () => { logout(); navigate('/login'); };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    (user?.first_name || '') + ' ' + (user?.last_name || '')
  )}&background=e0e7ff&color=4f46e5&rounded=true&size=128`;

  const today = new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  const pageLabel = (path: string) => {
    const all = [...PatientNavItems, ...DoctorNavItems,
      { path: '/profile', label: t.profile },
      { path: '/booking', label: t.booking },
      { path: '/settings', label: t.settings },
      { path: '/health-tracking', label: t.health_tracking }
    ];
    return all.find(n => path.startsWith(n.path))?.label ?? t.dashboard;
  };

  const SidebarContent = () => (
    <>
      <div className="sb-brand">
        <div className="sb-brand-icon"><HeartPulse size={20} color="white" /></div>
        <div>
          <span className="sb-brand-name">MedPilot</span>
          <span className="sb-brand-badge" style={{ display: 'inline-block', marginLeft: 6 }}>PRO</span>
        </div>
      </div>

      <div className="sb-user">
        <div className="sb-user-row">
          <img src={avatarUrl} alt="avatar" className="sb-user-avatar" />
          <div style={{ overflow: 'hidden' }}>
            <div className="sb-user-name">{user?.first_name} {user?.last_name}</div>
            <div className="sb-user-role">{isDoctor ? 'Hekim Paneli' : 'Hasta Paneli'}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginTop: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>{t.quick_access}</div>
      <div className="sb-nav">
        {navItems.map(item => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button key={item.path} className={`sb-nav-item ${active ? 'active' : ''}`} onClick={() => { navigate(item.path); setMobileOpen(false); }}>
              <item.icon size={18} /> {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', marginTop: '1.5rem', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>{t.account}</div>
      <div className="sb-nav">
        <button className="sb-nav-item" onClick={() => { navigate('/profile'); setMobileOpen(false); }}>
          <UserCircle size={18} /> {t.profile}
        </button>
        <button className="sb-nav-item" onClick={() => { navigate('/settings'); setMobileOpen(false); }}>
          <Settings size={18} /> {t.settings}
        </button>
        {!isDoctor && (
          <button className="sb-nav-item" onClick={() => { navigate('/health-tracking'); setMobileOpen(false); }}>
            <Activity size={18} /> {t.health_tracking}
          </button>
        )}
      </div>

      <div style={{ marginTop: 'auto', padding: '1rem 1.25rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '.75rem 1rem', borderRadius: '12px', fontSize: '.875rem', fontWeight: 600, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer' }} onClick={handleLogout}>
          <LogOut size={16} /> {t.logout}
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{S}</style>
      <div className="dash-root">
        <aside className="sidebar"><SidebarContent /></aside>
        <div className="dash-main">
          <div className="dash-topbar">
            <div className="topbar-breadcrumb">MedPilot / <span className="topbar-breadcrumb-current">{pageLabel(location.pathname)}</span></div>
            <div className="topbar-actions">
              <span className="topbar-date">{today}</span>
              <button className="topbar-notif-btn" onClick={() => navigate('/settings')}>
                <Settings size={17} color="var(--text-secondary)" />
              </button>
              <img src={avatarUrl} alt="user" style={{ width: 36, height: 36, borderRadius: 10, cursor: 'pointer', border: '2px solid var(--border-color)' }} onClick={() => navigate('/profile')} />
            </div>
          </div>
          <div className="dash-content"><Outlet /></div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
