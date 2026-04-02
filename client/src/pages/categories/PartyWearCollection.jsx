import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Net Frocks', img: '/images/subcategories/net-frocks.png' },
  { label: 'Gown Style Frocks', img: '/images/subcategories/gown-style-frocks.png' },
  { label: 'Layered / Frill Frocks', img: '/images/subcategories/layered-frill-frocks.png' },
  { label: 'Sequin / Glitter Frocks', img: '/images/subcategories/sequin-glitter-frocks.png' },
  { label: 'Designer Party Wear', img: '/images/subcategories/designer-party-wear.png' },
];

export default function PartyWearCollection() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

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