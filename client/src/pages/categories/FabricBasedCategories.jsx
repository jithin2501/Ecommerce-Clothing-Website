import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Cotton Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Net Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Satin Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Silk Frocks', img: '/images/collections/Pre-Teen.webp' },
  { label: 'Organza Frocks', img: '/images/collections/infant.webp' },
  { label: 'Velvet Frocks (Winter Special)', img: '/images/collections/newborn.avif' },
];

export default function FabricBasedCategories() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

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
          <div
            key={item.label}
            className="catpage-card"
            onClick={() => navigate('/collections', { state: { category: 'Fabric-Based Categories', subcategory: item.label } })}
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
