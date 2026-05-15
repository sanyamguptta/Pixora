import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import api from '../api/axios';

export default function LikeButton({ postId, initialLiked = false, initialCount = 0, onToggle }) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const controls = useAnimation();

  async function handleClick(e) {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      if (liked) {
        await api.post(`/posts/unlike/${postId}`);
        setLiked(false);
        setCount(c => Math.max(0, c - 1));
      } else {
        await api.post(`/posts/like/${postId}`);
        setLiked(true);
        setCount(c => c + 1);
        // Spring pop animation
        await controls.start({
          scale: [1, 1.5, 0.9, 1.15, 1],
          transition: { duration: 0.45, times: [0, 0.25, 0.5, 0.75, 1] },
        });
      }
      onToggle?.(!liked);
    } catch (err) {
      console.error('Like toggle failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: loading ? 'default' : 'pointer',
        padding: '4px 0',
        color: liked ? '#F59E0B' : '#8A8A96',
        transition: 'color 0.2s ease',
      }}
    >
      <motion.span animate={controls} style={{ display: 'flex', alignItems: 'center' }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={liked ? '#F59E0B' : 'none'}
          stroke={liked ? '#F59E0B' : '#8A8A96'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </motion.span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'Manrope, sans-serif',
          letterSpacing: '0.02em',
          color: liked ? '#F59E0B' : '#8A8A96',
          transition: 'color 0.2s ease',
        }}
      >
        {count}
      </span>
    </button>
  );
}
