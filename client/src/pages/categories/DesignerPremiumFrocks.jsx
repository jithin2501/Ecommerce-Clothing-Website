import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Boutique Designer Frocks', img: '/images/subcategories/boutique-designer-frocks.png' },
  { label: 'Handwork / Embroidery Frocks', img: '/images/subcategories/handwork-embroidery-frocks.png' },
  { label: 'Custom Made Frocks', img: '/images/subcategories/custom-made-frocks.png' },
  { label: 'Luxury Collection', img: '/images/subcategories/luxury-collection.png' },
];

export default function DesignerPremiumFrocks() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="catpage-wrapper">
      <nav className="catpage-breadcrumb">
        <Link to="/" onClick={() => sessionStorage.setItem('goHome', '1')}>Home</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <Link to="/" onClick={() => sessionStorage.setItem('scrollTarget', 'collections')}>Category</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <span className="catpage-breadcrumb-current">Designer &amp; Premium Frocks</span>
      </nav>

      <h1 className="catpage-title">Designer &amp; Premium Frocks</h1>
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