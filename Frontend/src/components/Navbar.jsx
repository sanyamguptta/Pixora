import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navItems = [
  {
    to: '/',
    label: 'Feed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: '/upload',
    label: 'Create',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const activeStyle = {
    color: '#F59E0B',
  };
  const inactiveStyle = {
    color: '#8A8A96',
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          background: '#121215',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 0',
          zIndex: 100,
        }}
        className="desktop-nav"
      >
        {/* Logo */}
        <div
          style={{ padding: '0 28px 36px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: '0.12em',
                color: '#F0EEE9',
              }}
            >
              PIXORA
            </span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#F59E0B',
                marginBottom: 8,
                display: 'inline-block',
              }}
            />
          </div>
          <p style={{ color: '#3A3A42', fontSize: 11, fontFamily: 'Manrope', letterSpacing: '0.1em', margin: 0, marginTop: 2 }}>
            EDITORIAL SOCIAL
          </p>
        </div>

        {/* Nav Links */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '0 16px' }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderRadius: 10,
                textDecoration: 'none',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                ...(isActive ? activeStyle : inactiveStyle),
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        marginLeft: 'auto',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#F59E0B',
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* User & Logout */}
        <div style={{ padding: '0 16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0D0D0F',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.username?.[0]?.toUpperCase()
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#F0EEE9', fontWeight: 600, fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.username}
                </p>
                <p style={{ color: '#8A8A96', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '11px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              color: '#8A8A96',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.color = '#F59E0B'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#8A8A96'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(18,18,21,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
          zIndex: 100,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        className="mobile-nav"
      >
        {[...navItems, {
          to: null,
          label: 'Logout',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          ),
        }].map((item, i) =>
          item.to ? (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
                padding: '4px 16px',
                ...(isActive ? activeStyle : inactiveStyle),
                fontSize: 10,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.08em',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? '#F59E0B' : '#8A8A96' }}>{item.icon}</span>
                  <span style={{ color: isActive ? '#F59E0B' : '#8A8A96' }}>{item.label.toUpperCase()}</span>
                </>
              )}
            </NavLink>
          ) : (
            <button
              key="logout"
              onClick={logout}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#8A8A96',
                padding: '4px 16px',
                fontSize: 10,
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              {item.icon}
              <span>EXIT</span>
            </button>
          )
        )}
      </nav>

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
