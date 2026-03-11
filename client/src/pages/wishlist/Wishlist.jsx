import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/wishlist/Wishlist.css';

const wishlistItems = [
  {
    id: 1,
    name: 'Organic Cotton Ribbed Onesie',
    brand: 'Petit Assured',
    price: 34.00,
    originalPrice: 45.00,
    discount: '25% off',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=100&h=100&fit=crop',
    available: true,
  },
  {
    id: 2,
    name: 'Merino Wool Baby Set – Sage Green',
    brand: 'Petit Assured',
    price: 89.00,
    originalPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&h=100&fit=crop',
    available: false,
  },
  {
    id: 3,
    name: 'Linen Blend Summer Dress',
    brand: 'Petit Assured',
    price: 52.00,
    originalPrice: 68.00,
    discount: '23% off',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop',
    available: true,
  },
  {
    id: 4,
    name: 'Soft Sole Leather Booties',
    brand: 'Petit Assured',
    price: 42.00,
    originalPrice: null,
    discount: null,
    limitedStock: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    available: true,
  },
];

const recentlyViewed = [
  { id: 1, name: 'Corduroy Overalls', category: 'BABY BOY',  price: '$48.00', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=160&h=160&fit=crop' },
  { id: 2, name: 'Knitted Romper',    category: 'BABY GIRL', price: '$39.00', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=160&h=160&fit=crop' },
  { id: 3, name: 'Sun Protection Hat',category: 'ACCESSORIES',price: '$22.00', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=160&h=160&fit=crop' },
  { id: 4, name: 'Bamboo PJs',        category: 'SLEEPWEAR', price: '$35.00', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=160&h=160&fit=crop' },
];

export default function Wishlist() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const navigate = useNavigate();
  const [activeNav, setActiveNav]       = useState('mystuff');
  const [activeSubNav, setActiveSubNav] = useState('wishlist');
  const [items, setItems]               = useState(wishlistItems);

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

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
            <h1>My Wishlist <span className="wl-count">({items.length})</span></h1>
            <div className="wl-breadcrumb">
              <span onClick={() => navigate('/account')} className="wl-breadcrumb-link">Account</span>
              <span className="wl-breadcrumb-sep">/</span>
              <span>Wishlist</span>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="wl-list">
            {items.map(item => (
              <div key={item.id} className="wl-card">
                <div className="wl-card-inner">

                  <img src={item.image} alt={item.name} className="wl-card-img" />

                  <div className="wl-card-info">
                    <div className="wl-card-name">{item.name}</div>
                    <div className="wl-card-brand">
                      <span className="wl-brand-dot" /> {item.brand}
                    </div>

                    <div className="wl-card-pricing">
                      <span className="wl-price">${item.price.toFixed(2)}</span>
                      {item.limitedStock && (
                        <span className="wl-limited">Limited Stock</span>
                      )}
                    </div>

                    {item.available ? (
                      <button className="wl-add-btn">Add to Bag</button>
                    ) : (
                      <button className="wl-notify-btn">Notify Me</button>
                    )}

                    {!item.available && (
                      <div className="wl-unavailable-badge">CURRENTLY UNAVAILABLE</div>
                    )}
                  </div>

                  <button className="wl-remove-btn" onClick={() => removeItem(item.id)}>
                    <img src="/images/wishlist/delete.png" alt="delete" className="wl-remove-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Viewed */}
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