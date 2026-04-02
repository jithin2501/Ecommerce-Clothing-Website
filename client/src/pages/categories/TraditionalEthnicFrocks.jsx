import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Pattu Pavadai (Silk Frocks)', img: '/images/collections/Little Girls.jpg' },
  { label: 'Banarasi Silk Frocks', img: '/images/collections/Pre-Teen.webp' },
  { label: 'Lehenga Choli Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Anarkali Style Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Cotton Ethnic Frocks', img: '/images/collections/Infant.webp' },
  { label: 'Indo-Western Fusion Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Gota Patti / Zari Work Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Kalamkari / Block Print Frocks', img: '/images/collections/Infant.webp' },
  { label: 'Dhoti Style Frocks', img: '/images/collections/newborn.avif' },
  { label: 'Half-Saree Style Frocks', img: '/images/collections/Pre-Teen.webp' },
];

export default function TraditionalEthnicFrocks() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

  return (
    <div className="catpage-wrapper">
      <nav className="catpage-breadcrumb">
        <Link to="/" onClick={() => sessionStorage.setItem('goHome', '1')}>Home</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <Link to="/" onClick={() => sessionStorage.setItem('scrollTarget', 'collections')}>Category</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <span className="catpage-breadcrumb-current">Traditional &amp; Ethnic Frocks</span>
      </nav>

      <h1 className="catpage-title">Traditional &amp; Ethnic Frocks</h1>
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
