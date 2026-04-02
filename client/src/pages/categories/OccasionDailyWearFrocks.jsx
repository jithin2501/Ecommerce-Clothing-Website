import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Birthday Party Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Wedding / Festive Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Reception / Evening Wear', img: '/images/collections/Pre-Teen.webp' },
  { label: 'Photoshoot Special Frocks', img: '/images/collections/Infant.webp' },
  { label: 'Princess / Fancy Dress', img: '/images/collections/newborn.avif' },
  { label: 'Casual Cotton Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Playtime Frocks', img: '/images/collections/Kids.webp' },
  { label: 'School Casual Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Summer Wear Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Comfortable Home Wear', img: '/images/collections/Infant.webp' },
];

export default function OccasionDailyWearFrocks() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

  return (
    <div className="catpage-wrapper">
      <nav className="catpage-breadcrumb">
        <Link to="/" onClick={() => sessionStorage.setItem('goHome', '1')}>Home</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <Link to="/" onClick={() => sessionStorage.setItem('scrollTarget', 'collections')}>Category</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <span className="catpage-breadcrumb-current">Occasion &amp; Daily Wear Frocks</span>
      </nav>

      <h1 className="catpage-title">Occasion &amp; Daily Wear Frocks</h1>
      <div className="catpage-divider" />

      <div className="catpage-grid">
        {subcategories.map((item) => (
          <div
            key={item.label}
            className="catpage-card"
            onClick={() => navigate('/collections', { state: { subcategory: item.label } })}
          >
            <div className="catpage-img-wrap">
              <img src={item.img} alt={item.label} />
            </div>
            <p className="catpage-label">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
