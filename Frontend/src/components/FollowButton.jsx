import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../api/axios';

export default function FollowButton({ username, initialFollowing = false, onToggle }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      if (following) {
        await api.post(`/users/unfollow/${username}`);
        setFollowing(false);
        if (onToggle) onToggle(false);
      } else {
        await api.post(`/users/follow/${username}`);
        setFollowing(true);
        if (onToggle) onToggle(true);
      }
    } catch (err) {
      console.error('Follow toggle failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      whileTap={{ scale: 0.96 }}
      animate={{
        backgroundColor: following ? '#1A1A1F' : '#F59E0B',
        color: following ? '#F0EEE9' : '#0D0D0F',
        borderColor: following ? 'rgba(245,158,11,0.4)' : '#F59E0B',
      }}
      transition={{ duration: 0.25 }}
      style={{
        padding: '10px 28px',
        borderRadius: 8,
        border: '1px solid',
        cursor: loading ? 'default' : 'pointer',
        fontSize: 13,
        fontWeight: 700,
        fontFamily: 'Manrope, sans-serif',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        outline: 'none',
        minWidth: 120,
        justifyContent: 'center',
      }}
    >
      {loading ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <motion.circle
            cx="12" cy="12" r="9"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="20"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }}
          />
        </svg>
      ) : following ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Following
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Follow
        </>
      )}
    </motion.button>
  );
}
