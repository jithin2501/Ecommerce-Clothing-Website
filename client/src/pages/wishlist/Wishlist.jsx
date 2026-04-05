import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { useWishlist } from '../../context/WishlistContext';
import { useState } from 'react';
import '../../styles/wishlist/Wishlist.css';

const toAgeGroup = (age) => {
  if (age === '0-2Y') return 'newborn';
  if (age === '3-6Y') return 'toddler';
  return 'junior';
};

const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Wishlist() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [activeNav, setActiveNav] = useState('mystuff');
  const [activeSubNav, setActiveSubNav] = useState('wishlist');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple delay to ensure smooth transition and allow sidebar to load
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="account-loading-wrapper">
        <div className="account-loading-spinner"></div>
        <p>Loading your Wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wl-page">
      <div className="wl-container">

        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          activeSubNav={activeSubNav}
          setActiveSubNav={setActiveSubNav}
        />

        <main className="wl-main">

          {/* Mobile-only back button */}
          <button className="mobile-back-btn" onClick={() => navigate('/account')}>
            <span className="back-chevron">&lt;</span>
          </button>

          {/* Header */}
          <div className="wl-header">
            <h1>My Wishlist <span className="wl-count">({wishlist.length})</span></h1>
            <div className="wl-breadcrumb">
              <span onClick={() => navigate('/account')} className="wl-breadcrumb-link">Account</span>
              <span className="wl-breadcrumb-sep">/</span>
              <span>Wishlist</span>
            </div>
          </div>

          {/* Empty State or List */}
          {wishlist.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon">
                <img
                  src="/images/wishlist/heart.png"
                  alt="Empty wishlist"
                  className="wl-empty-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/4379/4379479.png';
                  }}
                />
              </div>
              <p className="wl-empty-title">Your wishlist is empty</p>
              <p className="wl-empty-sub">Press the ♡ on any product to save it here.</p>
              <button className="wl-shop-btn" onClick={() => navigate('/collections')}>
                Browse Collections
              </button>
            </div>
          ) : (
            <div className="wl-list">
              {wishlist.map(item => (
                <div key={item.id} className="wl-card">
                  <div
                    className="wl-card-inner"
                    onClick={() => navigate(`/collections/product/${item.productId || item.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="wl-card-img"
                    />
                    <div className="wl-card-info">
                      <div className="wl-card-name">{item.name}</div>
                      <div className="wl-card-brand">
                        <span className="wl-brand-dot" /> {item.category}
                      </div>
                      <div className="wl-card-pricing">
                        <span className="wl-price">{item.price}</span>
                        {item.oldPrice && (
                          <span className="wl-old-price">{item.oldPrice}</span>
                        )}
                      </div>
                    </div>
                    <button className="wl-remove-btn" onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.id); }}>
                      <img src="/images/wishlist/delete.png" alt="delete" className="wl-remove-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
