import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Cotton Frocks', img: '/images/subcategories/cotton-frocks.png' },
  { label: 'Net Frocks', img: '/images/subcategories/net-frocks.png' },
  { label: 'Satin Frocks', img: '/images/subcategories/satin-frocks.png' },
  { label: 'Silk Frocks', img: '/images/subcategories/silk-frocks.png' },
  { label: 'Organza Frocks', img: '/images/subcategories/organza-frocks.png' },
  { label: 'Velvet Frocks (Winter Special)', img: '/images/subcategories/velvet-frocks.png' },
];

export default function FabricBasedCategories() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <div className="catpage-wrapper">
      <nav className="catpage-breadcrumb">
        <Link to="/" onClick={() => sessionStorage.setItem('goHome', '1')}>Home</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <Link to="/" onClick={() => sessionStorage.setItem('scrollTarget', 'collections')}>Category</Link>
        <span className="catpage-breadcrumb-sep">›</span>
        <span className="catpage-breadcrumb-current">Fabric-Based Categories</span>
      </nav>

      <h1 className="catpage-title">Fabric-Based Categories</h1>
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