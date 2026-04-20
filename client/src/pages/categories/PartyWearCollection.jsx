import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Net Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Gown Style Frocks', img: '/images/collections/Pre-Teen.webp' },
  { label: 'Layered / Frill Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Sequin / Glitter Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Princess Frocks', img: '/images/collections/newborn.avif' },
  { label: 'Satin / Silk Dress', img: '/images/collections/Infant.webp' },
  { label: 'Velvet Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Floral Embellished Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Indo-Western Party Gowns', img: '/images/collections/Pre-Teen.webp' },
  { label: 'High-Low Frocks', img: '/images/collections/Kids.webp' },
];

export default function PartyWearCollection() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

  return (
    <div className="catpage-wrapper">
      <SEO 
        title="Party Wear Collection"
        description="Premium party wear frocks for kids. From net and gown styles to sequin and princess frocks, find the perfect outfit for your child's next event."
        keywords="party wear frocks, kids net frocks, gown style frocks, sequin frocks, princess dresses, designer party wear kids"
        url="https://sumathitrends.com/collections/party-wear-collection"
      />


      <h1 className="catpage-title">Party Wear Collection</h1>
      <div className="catpage-divider" />

      <div className="catpage-grid">
        {subcategories.map((item) => (
          <div
            key={item.label}
            className="catpage-card"
            onClick={() => navigate('/collections', { state: { category: 'Party Wear Collection', subcategory: item.label } })}
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
