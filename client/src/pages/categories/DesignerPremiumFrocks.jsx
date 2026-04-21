import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import '../../styles/homepage/Category.css';

const subcategories = [
  {
    label: 'Boutique Designer Frocks',
    img: '/images/collections/Kids.webp'
  },
  {
    label: 'Handwork / Embroidery Frocks',
    img: '/images/collections/Little Girls.jpg'
  },
  {
    label: 'Custom Made Frocks',
    img: '/images/collections/Toddler.webp'
  },
  {
    label: 'Luxury Collection',
    img: '/images/collections/Pre-Teen.webp'
  },
];

export default function DesignerPremiumFrocks() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

  return (
    <div className="catpage-wrapper">
      <SEO 
        title="Designer & Premium Frocks"
        description="Exclusive boutique designer frocks and handwork embroidery collections. Discover custom-made luxury frocks at Sumathi Trends."
        keywords="designer kids frocks, boutique frocks, embroidery frocks, custom made kids wear, luxury children clothing"
        url="https://sumathitrends.com/collections/designer-premium-frocks"
      />


      <h1 className="catpage-title">Designer &amp; Premium Frocks</h1>
      <div className="catpage-divider" />

      <div className="catpage-grid">
        {subcategories.map((item) => (
          <div
            key={item.label}
            className="catpage-card"
            onClick={() => navigate('/collections', { state: { category: 'Designer & Premium Frocks', subcategory: item.label } })}
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
