import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';

export default function PostCard({ post, index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/post/${post._id}`)}
      style={{
        background: '#1A1A1F',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
        marginBottom: 24,
        transition: 'box-shadow 0.3s ease',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Post Image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={post.imgURL}
          alt={post.caption || 'Post image'}
          style={{
            width: '100%',
            display: 'block',
            aspectRatio: '4/3',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to top, rgba(26,26,31,0.8), transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px 24px' }}>
        {/* Author Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#0D0D0F',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {post.user?.profileImage ? (
              <img src={post.user.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (post.user?.username || 'U')[0].toUpperCase()
            )}
          </div>
          <div>
            <p
              style={{
                color: '#F0EEE9',
                fontWeight: 600,
                fontSize: 14,
                margin: 0,
                fontFamily: 'Manrope, sans-serif',
              }}
              onClick={e => {
                e.stopPropagation();
                if (post.user?.username) navigate(`/user/${post.user.username}`);
              }}
            >
              {post.user?.username || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 600,
              color: '#F0EEE9',
              lineHeight: 1.5,
              margin: '0 0 16px 0',
              letterSpacing: '-0.01em',
            }}
          >
            {post.caption}
          </p>
        )}

        {/* Footer: Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 14,
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LikeButton
              postId={post._id}
              initialLiked={post.isLiked || false}
              initialCount={post.likeCount || 0}
            />
            {/* Comment Icon */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8A8A96', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F0EEE9'}
              onMouseLeave={e => e.currentTarget.style.color = '#8A8A96'}
              onClick={(e) => { e.stopPropagation(); navigate(`/post/${post._id}`); }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span style={{ fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>
                {post.commentCount || 0}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontSize: 11,
                color: '#3A3A42',
                fontFamily: 'Manrope, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Details
            </span>
            <SaveButton postId={post._id} initialSaved={post.isSaved || false} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
