import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Pattu Pavadai (Silk Frocks)',         img: '/images/subcategories/pattu-pavadai.png' },
  { label: 'Banarasi Silk Frocks',                img: '/images/subcategories/banarasi-silk-frocks.png' },
  { label: 'Lehenga Choli Frocks',                img: '/images/subcategories/lehenga-choli-frocks.png' },
  { label: 'Anarkali Style Frocks',               img: '/images/subcategories/anarkali-style-frocks.png' },
  { label: 'Cotton Ethnic Frocks',                img: '/images/subcategories/cotton-ethnic-frocks.png' },
  { label: 'Indo-Western Fusion Frocks',          img: '/images/subcategories/indo-western-fusion-frocks.png' },
  { label: 'Gota Patti / Zari Work Frocks',       img: '/images/subcategories/gota-patti-frocks.png' },
  { label: 'Kalamkari / Block Print Frocks',      img: '/images/subcategories/kalamkari-block-print.png' },
  { label: 'Dhoti Style Frocks',                  img: '/images/subcategories/dhoti-style-frocks.png' },
  { label: 'Half-Saree Style Frocks',             img: '/images/subcategories/half-saree-style.png' },
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