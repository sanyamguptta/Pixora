import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  async function onSubmit(data) {
    setError('');
    setLoading(true);
    try {
      await registerUser({ username: data.username, email: data.email, password: data.password });
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '13px 16px',
    background: '#1A1A1F',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 10,
    color: '#F0EEE9',
    fontSize: 14,
    fontFamily: 'Manrope, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  const labelStyle = {
    display: 'block',
    color: '#8A8A96',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    marginBottom: 8,
    fontFamily: 'Manrope',
  };

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
        {/* Left Hero */}
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
          <div style={{
            position: 'absolute', top: '30%', left: '25%', width: 400, height: 400,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.15em', color: '#F0EEE9' }}>PIXORA</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', marginBottom: 8, display: 'inline-block' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(40px, 5vw, 60px)',
                fontWeight: 700,
                color: '#F0EEE9',
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Create your
              <br />
              <em style={{ color: '#F59E0B', fontStyle: 'italic' }}>space.</em>
            </h1>
            <p style={{ marginTop: 20, color: '#8A8A96', fontSize: 15, fontFamily: 'Manrope', lineHeight: 1.7, maxWidth: 360 }}>
              Join Pixora. Publish your visual story, connect with curators and creators.
            </p>
          </motion.div>

          <p style={{ color: '#3A3A42', fontSize: 11, fontFamily: 'Manrope', letterSpacing: '0.12em', position: 'relative', zIndex: 1 }}>
            © 2026 PIXORA
          </p>
        </div>

        {/* Right Form */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 52px' }} className="auth-form-panel">
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
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#F0EEE9', margin: '0 0 6px' }}>
              Join Pixora
            </h2>
            <p style={{ color: '#8A8A96', fontSize: 14, fontFamily: 'Manrope', margin: '0 0 32px' }}>
              Create your editorial presence
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>USERNAME</label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Min. 3 characters' } })}
                  placeholder="your_handle"
                  style={inputStyle(errors.username)}
                  onFocus={e => e.target.style.borderColor = '#F59E0B'}
                  onBlur={e => e.target.style.borderColor = errors.username ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                />
                {errors.username && <p style={{ color: '#ef4444', fontSize: 12, margin: '5px 0 0', fontFamily: 'Manrope' }}>{errors.username.message}</p>}
              </div>

              <div>
                <label style={labelStyle}>EMAIL</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="you@example.com"
                  style={inputStyle(errors.email)}
                  onFocus={e => e.target.style.borderColor = '#F59E0B'}
                  onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                />
                {errors.email && <p style={{ color: '#ef4444', fontSize: 12, margin: '5px 0 0', fontFamily: 'Manrope' }}>{errors.email.message}</p>}
              </div>

              <div>
                <label style={labelStyle}>PASSWORD</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min. 6 characters' } })}
                  placeholder="••••••••"
                  style={inputStyle(errors.password)}
                  onFocus={e => e.target.style.borderColor = '#F59E0B'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255,255,255,0.08)'}
                />
                {errors.password && <p style={{ color: '#ef4444', fontSize: 12, margin: '5px 0 0', fontFamily: 'Manrope' }}>{errors.password.message}</p>}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#ef4444', fontSize: 13, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', margin: 0, fontFamily: 'Manrope' }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', padding: '14px', background: '#F59E0B', border: 'none', borderRadius: 10,
                  color: '#0D0D0F', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.06em', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  opacity: loading ? 0.8 : 1, marginTop: 6,
                }}
              >
                {loading ? <Loader size={18} /> : 'CREATE ACCOUNT'}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 28, color: '#8A8A96', fontSize: 14, fontFamily: 'Manrope' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 600 }}>
                Sign in →
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
