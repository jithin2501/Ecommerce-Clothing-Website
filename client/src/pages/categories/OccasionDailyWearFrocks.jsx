import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Birthday Party Frocks', img: '/images/subcategories/birthday-party-frocks.png' },
  { label: 'Wedding / Festive Frocks', img: '/images/subcategories/wedding-festive-frocks.png' },
  { label: 'Reception / Evening Wear', img: '/images/subcategories/reception-evening-wear.png' },
  { label: 'Photoshoot Special Frocks', img: '/images/subcategories/photoshoot-special-frocks.png' },
  { label: 'Princess / Fancy Dress', img: '/images/subcategories/princess-fancy-dress.png' },
  { label: 'Casual Cotton Frocks', img: '/images/subcategories/casual-cotton-frocks.png' },
  { label: 'Playtime Frocks', img: '/images/subcategories/playtime-frocks.png' },
  { label: 'School Casual Frocks', img: '/images/subcategories/school-casual-frocks.png' },
  { label: 'Summer Wear Frocks', img: '/images/subcategories/summer-wear-frocks.png' },
  { label: 'Comfortable Home Wear', img: '/images/subcategories/comfortable-home-wear.png' },
];

export default function OccasionDailyWearFrocks() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

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