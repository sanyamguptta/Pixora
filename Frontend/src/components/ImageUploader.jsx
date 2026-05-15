import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';

export default function ImageUploader({ onFileSelect }) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file);
  }, [onFileSelect]);

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function onInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function clearPreview() {
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            style={{
              border: `2px dashed ${dragOver ? '#F59E0B' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 16,
              padding: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              cursor: 'pointer',
              background: dragOver ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s ease',
              minHeight: 240,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Pulsing border animation when drag over */}
            {dragOver && (
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: -1,
                  borderRadius: 16,
                  border: '2px solid #F59E0B',
                  pointerEvents: 'none',
                }}
              />
            )}
            <motion.div
              animate={dragOver ? { scale: 1.1, color: '#F59E0B' } : { scale: 1, color: '#8A8A96' }}
              transition={{ duration: 0.2 }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#F0EEE9', fontWeight: 600, marginBottom: 4, fontSize: 15 }}>
                Drop your image here
              </p>
              <p style={{ color: '#8A8A96', fontSize: 13 }}>
                or <span style={{ color: '#F59E0B', textDecoration: 'underline' }}>browse files</span>
              </p>
              <p style={{ color: '#3A3A42', fontSize: 12, marginTop: 8 }}>
                PNG, JPG, WEBP — max 10MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onInputChange}
              style={{ display: 'none' }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              /* Film frame effect */
              padding: 12,
              background: '#0A0A0C',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Film sprockets top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: 14, height: 10, background: '#1A1A1F', borderRadius: 2 }} />
              ))}
            </div>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', maxHeight: 360, objectFit: 'cover', display: 'block', borderRadius: 4 }}
            />
            {/* Film sprockets bottom */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: 14, height: 10, background: '#1A1A1F', borderRadius: 2 }} />
              ))}
            </div>
            <button
              onClick={clearPreview}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#F0EEE9',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                backdropFilter: 'blur(8px)',
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
