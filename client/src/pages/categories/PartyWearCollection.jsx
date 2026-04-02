import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Net Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Gown Style Frocks', img: '/images/collections/Pre-Teen.webp' },
  { label: 'Layered / Frill Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Sequin / Glitter Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Princess Frocks', img: '/images/collections/newborn.avif' },
  { label: 'Satin / Silk Dress', img: '/images/collections/Infant.webp' },
  { label: 'Velvet Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Floral Embellished Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Indo-Western Party Gowns', img: '/images/collections/Pre-Teen.webp' },
  { label: 'High-Low Frocks', img: '/images/collections/Kids.webp' },
];

export default function PartyWearCollection() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

  return (
    <div className="catpage-wrapper">
      <nav className="catpage-breadcrumb">
        <Link to="/" onClick={() => sessionStorage.setItem('goHome', '1')}>Home</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <Link to="/" onClick={() => sessionStorage.setItem('scrollTarget', 'collections')}>Category</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <span className="catpage-breadcrumb-current">Party Wear Collection</span>
      </nav>

      <h1 className="catpage-title">Party Wear Collection</h1>
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