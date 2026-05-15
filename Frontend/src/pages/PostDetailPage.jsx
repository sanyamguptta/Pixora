import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/details/${postId}`),
          api.get(`/posts/comment/${postId}`)
        ]);
        setPost(postRes.data.post);
        setComments(commentsRes.data.comments || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Post not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();

  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/posts/comment/${postId}`, { text: newComment });
      // Optimistically add comment to list, though it won't have the user's profile image right away
      // the backend returns { message, comment: { text, user, createdAt } }
      const addedComment = {
        ...res.data.comment,
        userDetails: { username: res.data.comment.user } 
      };
      setComments([addedComment, ...comments]);
      setNewComment('');
      
      // Update comment count in post state optimistically
      setPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D0F' }}>
      <Navbar />
      <main style={{ flex: 1, marginLeft: 240, padding: '48px 40px', minHeight: '100vh' }} className="detail-main">
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Loader size={40} />
          </div>
        )}

        {error && !loading && (
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', paddingTop: 80 }}>
            <p style={{ color: '#8A8A96', fontFamily: 'Manrope', fontSize: 16 }}>{error}</p>
            <button onClick={() => navigate('/')} style={{ marginTop: 20, color: '#F59E0B', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Manrope', fontSize: 14 }}>
              ← Back to feed
            </button>
          </div>
        )}

        {post && !loading && (
          <PageTransition>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              {/* Back button */}
              <motion.button
                onClick={() => navigate(-1)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: -4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  color: '#8A8A96',
                  cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  marginBottom: 36,
                  padding: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                BACK
              </motion.button>

              {/* Two-column layout */}
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}
                className="detail-grid"
              >
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  <img
                    src={post.imgURL}
                    alt={post.caption}
                    style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                  />
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  style={{ paddingTop: 8 }}
                >
                  {/* Caption */}
                  {post.caption && (
                    <h1
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: '#F0EEE9',
                        lineHeight: 1.3,
                        margin: '0 0 28px',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {post.caption}
                    </h1>
                  )}

                  {/* Divider */}
                  <div style={{ width: 48, height: 2, background: '#F59E0B', borderRadius: 2, marginBottom: 28 }} />

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                    <div
                      style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700, color: '#0D0D0F',
                        overflow: 'hidden', flexShrink: 0,
                        boxShadow: '0 0 0 3px rgba(245,158,11,0.25)',
                      }}
                    >
                      {post.user?.profileImage
                        ? <img src={post.user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (post.user?.username || 'U')[0].toUpperCase()
                      }
                    </div>
                    <div>
                      <p
                        style={{ color: '#F0EEE9', fontWeight: 700, fontSize: 16, margin: 0, cursor: 'pointer', fontFamily: 'Manrope' }}
                        onClick={() => post.user?.username && navigate(`/user/${post.user.username}`)}
                      >
                        {post.user?.username || 'Unknown'}
                      </p>
                      <p style={{ color: '#8A8A96', fontSize: 12, margin: '2px 0 0', fontFamily: 'Manrope' }}>
                        AUTHOR
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    {/* Like button */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        background: '#1A1A1F',
                        borderRadius: 12,
                        padding: '16px 24px',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <LikeButton
                        postId={post._id}
                        initialLiked={post.isLiked}
                        initialCount={post.likeCount}
                      />
                      <span style={{ color: '#3A3A42', fontSize: 12, fontFamily: 'Manrope' }}>·</span>
                      <span style={{ color: '#8A8A96', fontSize: 12, fontFamily: 'Manrope', letterSpacing: '0.06em' }}>
                        {post.commentCount || 0} REPLIES
                      </span>
                    </div>

                    {/* Save button */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#1A1A1F',
                        borderRadius: 12,
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <SaveButton postId={post._id} initialSaved={post.isSaved} />
                    </div>
                  </div>

                  {/* Comment Input */}
                  <form onSubmit={handleCommentSubmit} style={{ marginBottom: 32 }}>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: '#1A1A1F',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 12,
                          color: '#F0EEE9',
                          fontSize: 14,
                          fontFamily: 'Manrope, sans-serif',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#F59E0B'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                      <button 
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          bottom: 8,
                          padding: '0 16px',
                          background: newComment.trim() ? '#F59E0B' : 'transparent',
                          color: newComment.trim() ? '#0D0D0F' : '#8A8A96',
                          border: 'none',
                          borderRadius: 8,
                          fontFamily: 'Manrope, sans-serif',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        POST
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {comments.map(comment => (
                      <div key={comment._id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                         <div
                            style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 14, fontWeight: 700, color: '#0D0D0F',
                              overflow: 'hidden', flexShrink: 0,
                            }}
                          >
                          {comment.userDetails?.profileImage
                            ? <img src={comment.userDetails.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (comment.userDetails?.username || 'U')[0].toUpperCase()
                          }
                        </div>
                        <div>
                          <p
                            style={{ color: '#F0EEE9', fontWeight: 700, fontSize: 14, margin: 0, cursor: 'pointer', fontFamily: 'Manrope' }}
                            onClick={() => navigate(`/user/${comment.userDetails?.username}`)}
                          >
                            {comment.userDetails?.username}
                          </p>
                          <p style={{ color: '#8A8A96', fontSize: 14, margin: '4px 0 0', fontFamily: 'Manrope', lineHeight: 1.5 }}>
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </PageTransition>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .detail-main { margin-left: 0 !important; padding: 24px 16px 100px !important; }
          .detail-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </div>
  );
}
