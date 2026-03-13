import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/myreviews/MyReviews.css';

const suggestedProducts = [
  {
    id: 1,
    name: 'Organic Cotton Cloud-Soft Romper Sage Green',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Organic Cotton Cloud-Soft Romper Sage Green',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=100&h=100&fit=crop',
  },
];

export default function MyReviews() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

  const [activeNav, setActiveNav]       = useState('mystuff');
  const [activeSubNav, setActiveSubNav] = useState('reviews');

  return (
    <div className="mr-page">
      <div className="mr-container">

        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          activeSubNav={activeSubNav}
          setActiveSubNav={setActiveSubNav}
        />

        <main className="mr-main">

          {/* Empty State */}
          <div className="mr-empty-section">
            <div className="mr-icon-wrap">
              <img
                src="/images/reviews/no-reviews.png"
                alt="No Reviews"
                className="mr-empty-img"
              />
            </div>

            <h2 className="mr-empty-title">No Reviews &amp; Ratings</h2>
            <p className="mr-empty-text">
              You haven't shared your thoughts on any products yet. Your feedback helps other parents find the perfect fit for their little ones!
            </p>
          </div>

          {/* Suggested Products */}
          <div className="mr-suggested-section">
            <h3 className="mr-suggested-title">Orders you might be interested in reviewing</h3>
            <div className="mr-product-grid">
              {suggestedProducts.map(p => (
                <div key={p.id} className="mr-product-card">
                  <img src={p.image} alt={p.name} className="mr-product-img" />
                  <div className="mr-product-info">
                    <p className="mr-product-name">{p.name}</p>
                    <div className="mr-stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className="mr-star">★</span>
                      ))}
                    </div>
                    <button className="mr-rate-btn" onClick={() => navigate('/collections')}>
                      Rate and Review ›
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}