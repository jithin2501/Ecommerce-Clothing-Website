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
        title="Luxury Designer Kids Frocks | Custom Boutique Wear Bengaluru"
        description="Shop the most exclusive boutique designer frocks in Bengaluru. From handwork embroidery to custom-made luxury collections, Sumathi Trends brings you the pinnacle of kids fashion."
        keywords="designer kids frocks Bengaluru, custom made kids clothes, premium children boutique, handwork embroidery frocks, boutique kids wear Kodigehalli, luxury kids fashion trends"
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
