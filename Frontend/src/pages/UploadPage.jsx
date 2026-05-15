import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import Toast, { useToast } from '../components/Toast';
import Loader from '../components/Loader';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();
  const MAX_CAPTION = 280;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      showToast('Please select an image first', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('img', file);
      formData.append('caption', caption);

      await api.post('/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Post published successfully!');
      setTimeout(() => navigate('/'), 1400);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Upload failed. Try again.', 'error');
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D0F' }}>
      <Navbar />

      <main style={{ flex: 1, marginLeft: 240, padding: '48px 40px', minHeight: '100vh' }} className="upload-main">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 40 }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 36,
                fontWeight: 700,
                color: '#F0EEE9',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              New Post
            </h1>
            <p style={{ color: '#8A8A96', fontSize: 14, fontFamily: 'Manrope', margin: '8px 0 0' }}>
              Share a moment worth publishing
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            {/* Image Uploader */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: 28 }}
            >
              <label style={{ display: 'block', color: '#8A8A96', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 12, fontFamily: 'Manrope' }}>
                IMAGE
              </label>
              <ImageUploader onFileSelect={setFile} />
            </motion.section>

            {/* Caption */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: 32 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ color: '#8A8A96', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', fontFamily: 'Manrope' }}>
                  CAPTION
                </label>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'Manrope',
                    color: caption.length > MAX_CAPTION * 0.85 ? '#F59E0B' : '#3A3A42',
                  }}
                >
                  {caption.length} / {MAX_CAPTION}
                </span>
              </div>
              <textarea
                value={caption}
                onChange={e => caption.length < MAX_CAPTION + 1 && setCaption(e.target.value.slice(0, MAX_CAPTION))}
                placeholder="Write something worth reading..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#1A1A1F',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  color: '#F0EEE9',
                  fontSize: 16,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#F59E0B'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </motion.section>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                type="submit"
                disabled={loading || !file}
                whileHover={!loading && file ? { scale: 1.02 } : {}}
                whileTap={!loading && file ? { scale: 0.97 } : {}}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: file ? '#F59E0B' : '#242429',
                  border: 'none',
                  borderRadius: 12,
                  color: file ? '#0D0D0F' : '#8A8A96',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'Manrope, sans-serif',
                  letterSpacing: '0.08em',
                  cursor: loading || !file ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'background 0.3s ease, color 0.3s ease',
                }}
              >
                {loading ? (
                  <>
                    <Loader size={18} />
                    PUBLISHING...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    PUBLISH POST
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <style>{`
        @media (max-width: 768px) {
          .upload-main { margin-left: 0 !important; padding: 24px 16px 100px !important; }
        }
      `}</style>
    </div>
  );
}
