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

const recentlyViewed = [
  { id: 1, name: 'Corduroy Overalls',  category: 'BABY BOY',   price: '$48.00', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=160&h=160&fit=crop' },
  { id: 2, name: 'Knitted Romper',     category: 'BABY GIRL',  price: '$39.00', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=160&h=160&fit=crop' },
  { id: 3, name: 'Sun Protection Hat', category: 'ACCESSORIES', price: '$22.00', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=160&h=160&fit=crop' },
  { id: 4, name: 'Bamboo PJs',         category: 'SLEEPWEAR',  price: '$35.00', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&h=160&fit=crop' },
];

export default function Wishlist() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [activeNav, setActiveNav]       = useState('mystuff');
  const [activeSubNav, setActiveSubNav] = useState('wishlist');

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
                  <div className="wl-card-inner">

                    <img
                      src={item.img}
                      alt={item.name}
                      className="wl-card-img"
                      onClick={() => navigate(`/collections/${toAgeGroup(item.age)}/${toSlug(item.name)}`)}
                      style={{ cursor: 'pointer' }}
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
                      <button
                        className="wl-add-btn"
                        onClick={() => navigate(`/collections/${toAgeGroup(item.age)}/${toSlug(item.name)}`)}
                      >
                        View Product
                      </button>
                    </div>

                    <button className="wl-remove-btn" onClick={() => removeFromWishlist(item.id)}>
                      <img src="/images/wishlist/delete.png" alt="delete" className="wl-remove-icon" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recently Viewed — always visible */}
          <div className="wl-recent">
            <h2 className="wl-recent-title">Recently Viewed</h2>
            <div className="wl-recent-grid">
              {recentlyViewed.map(item => (
                <div key={item.id} className="wl-recent-card">
                  <img src={item.image} alt={item.name} className="wl-recent-img" />
                  <div className="wl-recent-category">{item.category}</div>
                  <div className="wl-recent-name">{item.name}</div>
                  <div className="wl-recent-price">{item.price}</div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}