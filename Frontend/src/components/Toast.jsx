import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'success' ? '#1A1A1F' : '#1A1A1F';
  const accent = type === 'success' ? '#F59E0B' : '#ef4444';
  const icon = type === 'success' ? '✓' : '✕';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: bg,
          border: `1px solid ${accent}33`,
          borderRadius: 12,
          padding: '14px 20px',
          minWidth: 260,
          boxShadow: `0 0 24px ${accent}22, 0 8px 32px rgba(0,0,0,0.5)`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: accent,
            color: '#0D0D0F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <span style={{ color: '#F0EEE9', fontSize: 14, fontFamily: 'Manrope, sans-serif', fontWeight: 500 }}>
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#8A8A96',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: 2,
          }}
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// Simple toast state hook for use in pages
import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);
  return { toast, showToast, hideToast };
}
