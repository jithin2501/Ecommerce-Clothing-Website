import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Net Frocks', img: '/images/subcategories/net-frocks.png' },
  { label: 'Gown Style Frocks', img: '/images/subcategories/gown-style-frocks.png' },
  { label: 'Layered / Frill Frocks', img: '/images/subcategories/layered-frill-frocks.png' },
  { label: 'Sequin / Glitter Frocks', img: '/images/subcategories/sequin-glitter-frocks.png' },
  { label: 'Princess Frocks', img: '/images/subcategories/princess-frocks.png' },
  { label: 'Satin / Silk Dress', img: '/images/subcategories/satin-silk-dress.png' },
  { label: 'Velvet Frocks', img: '/images/subcategories/velvet-frocks.png' },
  { label: 'Floral Embellished Frocks', img: '/images/subcategories/floral-embellished-frocks.png' },
  { label: 'Indo-Western Party Gowns', img: '/images/subcategories/indo-western-party-gowns.png' },
  { label: 'High-Low Frocks', img: '/images/subcategories/high-low-frocks.png' },
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