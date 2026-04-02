import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Pattu / Silk Frocks', img: '/images/subcategories/pattu-silk-frocks.png' },
  { label: 'Lehenga Style Frocks', img: '/images/subcategories/lehenga-style-frocks.png' },
  { label: 'Anarkali Frocks', img: '/images/subcategories/anarkali-frocks.png' },
  { label: 'Indo-Western Styles', img: '/images/subcategories/indo-western-styles.png' },
  { label: 'Festival Special (Diwali, Navratri…)', img: '/images/subcategories/festival-special-frocks.png' },
];

export default function TraditionalEthnicFrocks() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

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
          <div key={item.label} className="catpage-card">
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