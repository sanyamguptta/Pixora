import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function SaveButton({ postId, initialSaved = false }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    // Optimistic UI update
    setIsSaved(!isSaved);

    try {
      if (!isSaved) {
        await api.post(`/posts/save/${postId}`);
      } else {
        await api.post(`/posts/unsave/${postId}`);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
      setIsSaved(!isSaved); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleSave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        padding: 6,
        cursor: 'pointer',
        color: isSaved ? '#F59E0B' : '#8A8A96',
        transition: 'color 0.2s ease',
      }}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isSaved ? '#F59E0B' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={isSaved ? { scale: [1, 1.25, 1], y: [0, -4, 0] } : { scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </motion.svg>
    </motion.button>
  );
}
