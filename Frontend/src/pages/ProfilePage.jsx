import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import FollowButton from '../components/FollowButton';
import Loader from '../components/Loader';
import PageTransition from '../components/PageTransition';
import Modal from '../components/Modal';

export default function ProfilePage() {
  const { username } = useParams(); // Defined for /user/:username, undefined for /profile
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = !username || username === currentUser?.username;
  const targetUsername = username || currentUser?.username;

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'saved'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [profileRes, savedRes] = await Promise.all([
          api.get(`/users/profile/${targetUsername}`),
          isOwnProfile ? api.get('/posts/saved') : Promise.resolve({ data: { posts: [] } })
        ]);

        setProfileUser(profileRes.data.user);
        setPosts(profileRes.data.posts || []);
        if (isOwnProfile) {
          setSavedPosts(savedRes.data.posts || []);
        }
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    if (targetUsername) {
      fetchData();
    }
  }, [targetUsername, isOwnProfile]);

  const displayUser = profileUser || (isOwnProfile ? currentUser : { username });
  const displayedGrid = activeTab === 'posts' ? posts : savedPosts;

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/profile/bio', { bio: newBio });
      setProfileUser(res.data.user);
      setIsBioModalOpen(false);
    } catch (err) {
      console.error('Failed to update bio', err);
    }
  };

  const openFollowersModal = async () => {
    setIsFollowersModalOpen(true);
    setLoadingLists(true);
    try {
      const res = await api.get(`/users/profile/${targetUsername}/followers`);
      setFollowersList(res.data.followers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLists(false);
    }
  };

  const openFollowingModal = async () => {
    setIsFollowingModalOpen(true);
    setLoadingLists(true);
    try {
      const res = await api.get(`/users/profile/${targetUsername}/following`);
      setFollowingList(res.data.following || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLists(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D0F' }}>
      <Navbar />

      <main style={{ flex: 1, marginLeft: 240, padding: '48px 40px', minHeight: '100vh' }} className="profile-main">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <PageTransition>
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 40,
                marginBottom: 56,
                paddingBottom: 48,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
              className="profile-hero"
            >
              {/* Avatar */}
              <div
                style={{
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    fontWeight: 700,
                    color: '#0D0D0F',
                    overflow: 'hidden',
                    boxShadow: '0 0 0 3px #0D0D0F, 0 0 0 5px #F59E0B, 0 0 32px rgba(245,158,11,0.3)',
                  }}
                >
                  {displayUser?.profileImage ? (
                    <img src={displayUser.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (displayUser?.username || 'U')[0].toUpperCase()
                  )}
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
                  <h1
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 28,
                      fontWeight: 800,
                      color: '#F0EEE9',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {displayUser?.username || username}
                  </h1>
                  {!isOwnProfile && profileUser && (
                    <FollowButton 
                      username={username} 
                      initialFollowing={profileUser?.isFollowing} 
                      onToggle={(isNowFollowing) => {
                        setProfileUser(prev => ({
                          ...prev,
                          followersCount: Math.max(0, (prev.followersCount || 0) + (isNowFollowing ? 1 : -1)),
                          isFollowing: isNowFollowing
                        }));
                      }}
                    />
                  )}
                  {isOwnProfile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span
                        style={{
                          background: 'rgba(245,158,11,0.12)',
                          color: '#F59E0B',
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: 'Manrope',
                          letterSpacing: '0.1em',
                          padding: '5px 12px',
                          borderRadius: 20,
                          border: '1px solid rgba(245,158,11,0.25)',
                        }}
                      >
                        YOU
                      </span>
                      <button
                        onClick={() => { setNewBio(profileUser?.bio || ''); setIsBioModalOpen(true); }}
                        style={{
                          background: 'transparent',
                          color: '#F0EEE9',
                          border: '1px solid rgba(255,255,255,0.2)',
                          padding: '6px 16px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: 'Manrope, sans-serif',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                      >
                        EDIT PROFILE
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: 36, marginBottom: 20 }}>
                  {[
                    { label: 'Posts', value: posts.length, onClick: null },
                    { label: 'Followers', value: profileUser?.followersCount ?? '—', onClick: openFollowersModal },
                    { label: 'Following', value: profileUser?.followingCount ?? '—', onClick: openFollowingModal },
                  ].map(stat => (
                    <div 
                      key={stat.label} 
                      onClick={stat.onClick} 
                      style={{ cursor: stat.onClick ? 'pointer' : 'default' }}
                    >
                      <p style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, color: '#F0EEE9', margin: 0 }}>
                        {stat.value}
                      </p>
                      <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#8A8A96', margin: '2px 0 0', letterSpacing: '0.06em' }}>
                        {stat.label.toUpperCase()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                {displayUser?.bio && (
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 16,
                      color: '#B0B0BA',
                      lineHeight: 1.6,
                      margin: 0,
                      fontStyle: 'italic',
                    }}
                  >
                    {displayUser.bio}
                  </p>
                )}
                {displayUser?.email && isOwnProfile && (
                  <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#3A3A42', margin: '8px 0 0' }}>
                    {displayUser.email}
                  </p>
                )}
              </div>
            </motion.section>

            {/* Posts Grid */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                <button
                  onClick={() => setActiveTab('posts')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeTab === 'posts' ? '#F0EEE9' : '#8A8A96',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s'
                  }}
                >
                  POSTS
                  {activeTab === 'posts' && (
                    <motion.div layoutId="tab-indicator" style={{ position: 'absolute', top: -21, left: 0, right: 0, height: 1, background: '#F0EEE9' }} />
                  )}
                </button>
                
                {isOwnProfile && (
                  <button
                    onClick={() => setActiveTab('saved')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: activeTab === 'saved' ? '#F0EEE9' : '#8A8A96',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'color 0.2s'
                    }}
                  >
                    SAVED
                    {activeTab === 'saved' && (
                      <motion.div layoutId="tab-indicator" style={{ position: 'absolute', top: -21, left: 0, right: 0, height: 1, background: '#F0EEE9' }} />
                    )}
                  </button>
                )}
              </div>

              {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                  <Loader size={32} />
                </div>
              )}

              {error && !loading && (
                <p style={{ color: '#8A8A96', fontFamily: 'Manrope', fontSize: 14 }}>{error}</p>
              )}

              {!loading && !error && displayedGrid.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', paddingTop: 60 }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>◻</div>
                  <p style={{ color: '#8A8A96', fontFamily: 'Manrope', fontSize: 15 }}>
                    {activeTab === 'posts' ? 'No posts yet' : 'No saved posts'}
                  </p>
                </motion.div>
              )}

              {/* 3-column grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8,
                }}
                className="posts-grid"
              >
                {displayedGrid.map((post, i) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/post/${post._id}`)}
                    style={{
                      aspectRatio: '1',
                      overflow: 'hidden',
                      borderRadius: 8,
                      cursor: 'pointer',
                      position: 'relative',
                      background: '#1A1A1F',
                    }}
                  >
                    <img
                      src={post.imgURL}
                      alt={post.caption}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    {/* Hover overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(13,13,15,0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,13,15,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(13,13,15,0)'}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          </PageTransition>
        </div>
      </main>

      {/* Edit Bio Modal */}
      <Modal isOpen={isBioModalOpen} onClose={() => setIsBioModalOpen(false)} title="Edit Profile">
        <form onSubmit={handleBioSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#8A8A96', fontSize: 13, fontFamily: 'Manrope', marginBottom: 8 }}>
              Bio
            </label>
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0D0D0F',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                color: '#F0EEE9',
                fontSize: 14,
                fontFamily: 'Manrope, sans-serif',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#F59E0B'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#F59E0B',
              color: '#0D0D0F',
              border: 'none',
              borderRadius: 12,
              fontFamily: 'Manrope, sans-serif',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Followers Modal */}
      <Modal isOpen={isFollowersModalOpen} onClose={() => setIsFollowersModalOpen(false)} title="Followers">
        <UserList users={followersList} loading={loadingLists} onUserClick={(username) => { setIsFollowersModalOpen(false); navigate(`/user/${username}`); }} />
      </Modal>

      {/* Following Modal */}
      <Modal isOpen={isFollowingModalOpen} onClose={() => setIsFollowingModalOpen(false)} title="Following">
        <UserList users={followingList} loading={loadingLists} onUserClick={(username) => { setIsFollowingModalOpen(false); navigate(`/user/${username}`); }} />
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          .profile-main { margin-left: 0 !important; padding: 24px 16px 100px !important; }
          .profile-hero { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .posts-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

// Sub-component to render lists of users
function UserList({ users, loading, onUserClick }) {
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader size={24} /></div>;
  }
  
  if (users.length === 0) {
    return <p style={{ color: '#8A8A96', textAlign: 'center', fontFamily: 'Manrope' }}>No users found.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {users.map(u => (
        <div 
          key={u.username}
          onClick={() => onUserClick(u.username)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 8, borderRadius: 8, transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#0D0D0F', overflow: 'hidden'
            }}
          >
            {u.profileImage ? (
              <img src={u.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (u.username || 'U')[0].toUpperCase()
            )}
          </div>
          <span style={{ color: '#F0EEE9', fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>
            {u.username}
          </span>
        </div>
      ))}
    </div>
  );
}
