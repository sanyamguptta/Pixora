import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await api.get('/posts/feed');
        setPosts(res.data.posts || []);
      } catch (err) {
        setError('Failed to load feed. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D0F' }}>
      <Navbar />

      {/* Main content offset for sidebar */}
      <main
        style={{ flex: 1, marginLeft: 240, padding: '48px 0', minHeight: '100vh' }}
        className="feed-main"
      >
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 32px' }} className="feed-inner">
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
              Your Feed
            </h1>
            <p style={{ color: '#8A8A96', fontSize: 14, fontFamily: 'Manrope', margin: '8px 0 0' }}>
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} — latest first
            </p>
          </motion.div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <Loader size={36} />
            </div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 12,
                padding: '20px 24px',
                color: '#ef4444',
                fontFamily: 'Manrope',
                fontSize: 14,
              }}
            >
              {error}
            </motion.div>
          )}

          {!loading && !error && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '80px 0' }}
            >
              <div style={{ fontSize: 56, marginBottom: 20 }}>✦</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#F0EEE9', marginBottom: 12 }}>
                Nothing here yet
              </h3>
              <p style={{ color: '#8A8A96', fontFamily: 'Manrope', fontSize: 14 }}>
                Follow people or create your first post.
              </p>
            </motion.div>
          )}

          {/* Post List */}
          <AnimatePresence>
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* FAB — Create Post */}
      <motion.button
        onClick={() => navigate('/upload')}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 260 }}
        style={{
          position: 'fixed',
          bottom: 36,
          right: 36,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: '#F59E0B',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 32px rgba(245,158,11,0.35), 0 8px 24px rgba(0,0,0,0.4)',
          zIndex: 50,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D0D0F" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </motion.button>

      <style>{`
        @media (max-width: 768px) {
          .feed-main { margin-left: 0 !important; padding-bottom: 90px !important; }
          .feed-inner { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
}
