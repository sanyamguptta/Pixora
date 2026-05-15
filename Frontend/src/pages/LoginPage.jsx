import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    setError('');
    setLoading(true);
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#0D0D0F',
        }}
      >
        {/* Left Hero Panel */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0D0D0F 0%, #1a1400 50%, #0D0D0F 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px 52px',
          }}
          className="auth-hero"
        >
          {/* Ambient blobs */}
          <div style={{
            position: 'absolute', top: '20%', left: '30%', width: 400, height: 400,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '20%', width: 300, height: 300,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.15em', color: '#F0EEE9' }}>
              PIXORA
            </span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', marginBottom: 8, display: 'inline-block' }} />
          </div>

          {/* Herotext */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(40px, 5vw, 68px)',
                fontWeight: 700,
                color: '#F0EEE9',
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Share What
              <br />
              <em style={{ color: '#F59E0B', fontStyle: 'italic' }}>Moves</em>
              <br />
              You.
            </h1>
            <p
              style={{
                marginTop: 24,
                color: '#8A8A96',
                fontSize: 16,
                fontFamily: 'Manrope, sans-serif',
                lineHeight: 1.7,
                maxWidth: 400,
              }}
            >
              A curated space for visual storytelling. Post moments that matter, follow minds that inspire.
            </p>
          </motion.div>

          {/* Bottom label */}
          <p style={{ color: '#3A3A42', fontSize: 11, fontFamily: 'Manrope', letterSpacing: '0.12em', position: 'relative', zIndex: 1 }}>
            © 2026 PIXORA
          </p>
        </div>

        {/* Right Form Panel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 52px',
          }}
          className="auth-form-panel"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            style={{
              width: '100%',
              maxWidth: 400,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '44px 40px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                fontWeight: 700,
                color: '#F0EEE9',
                margin: 0,
                marginBottom: 6,
              }}
            >
              Welcome back
            </h2>
            <p style={{ color: '#8A8A96', fontSize: 14, fontFamily: 'Manrope', margin: '0 0 32px' }}>
              Sign in to your Pixora account
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', color: '#8A8A96', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8, fontFamily: 'Manrope' }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#1A1A1F',
                    border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 10,
                    color: '#F0EEE9',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#F59E0B'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                />
                {errors.email && <p style={{ color: '#ef4444', fontSize: 12, margin: '6px 0 0', fontFamily: 'Manrope' }}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', color: '#8A8A96', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8, fontFamily: 'Manrope' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#1A1A1F',
                    border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 10,
                    color: '#F0EEE9',
                    fontSize: 14,
                    fontFamily: 'Manrope, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#F59E0B'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                />
                {errors.password && <p style={{ color: '#ef4444', fontSize: 12, margin: '6px 0 0', fontFamily: 'Manrope' }}>{errors.password.message}</p>}
              </div>

              {/* Error message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#ef4444',
                    fontSize: 13,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    margin: 0,
                    fontFamily: 'Manrope',
                  }}
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#F59E0B',
                  border: 'none',
                  borderRadius: 10,
                  color: '#0D0D0F',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.06em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: loading ? 0.8 : 1,
                  marginTop: 4,
                }}
              >
                {loading ? <Loader size={18} /> : 'SIGN IN'}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 28, color: '#8A8A96', fontSize: 14, fontFamily: 'Manrope' }}>
              New here?{' '}
              <Link to="/register" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 600 }}>
                Create an account.
              </Link>
            </p>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .auth-hero { display: none !important; }
            .auth-form-panel { grid-column: 1 / -1; padding: 40px 24px; }
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
