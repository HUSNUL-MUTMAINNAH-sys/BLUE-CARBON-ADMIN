import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoBantaeng from '../../assets/logo-bantaeng.png';
import { useAuth } from '../../context/AuthContext';
import './layout.css';

// URL situs publik (web-publik). Diisi lewat env var saat deploy ke Vercel;
// fallback ke localhost untuk development lokal.
const PUBLIC_SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173/';

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  lahan: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.33-7-11a7 7 0 0 1 14 0c0 5.67-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  berita: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="13" height="16" rx="1.5" />
      <path d="M16.5 8h4v9.5a2.5 2.5 0 0 1-2.5 2.5h-14" />
      <path d="M7 8.5h6M7 11.5h6M7 14.5h4" />
    </svg>
  ),
  monitoring: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5-5 4 4 8-9" />
      <path d="M15 7h5v5" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { to: '/', end: true, icon: 'dashboard', label: 'Dashboard' },
  { to: '/berita', end: false, icon: 'berita', label: 'Berita' },
  { to: '/data-lahan', end: false, icon: 'lahan', label: 'Data Lahan' },
  { to: '/monitoring', end: false, icon: 'monitoring', label: 'MRV / Monitoring' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label="Buka menu"
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {open && <div className="sidebar-scrim" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar ${open ? 'admin-sidebar--open' : ''}`}>
        <NavLink to="/" className="sidebar-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src={logoBantaeng} alt="" />
          </span>
          <span className="brand-text">
            <strong>Blue Carbon</strong>
            <small>Admin Panel</small>
          </span>
        </NavLink>

        <nav className="sidebar-menu">
          <span className="sidebar-menu__label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? 'sidebar-link sidebar-link--active' : 'sidebar-link'
              }
            >
              <span className="sidebar-link__icon">{ICONS[item.icon]}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-user__avatar">AD</span>
            <div>
              <strong>Admin</strong>
              <small title={user?.email}>{user?.email || 'Kelurahan Lembang'}</small>
            </div>
          </div>
          <a
            className="sidebar-public-link"
            href={PUBLIC_SITE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Lihat Situs Publik ↗
          </a>
          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
