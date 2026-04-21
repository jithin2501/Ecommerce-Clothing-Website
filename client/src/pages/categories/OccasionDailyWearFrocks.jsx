import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import '../../styles/homepage/Category.css';

const subcategories = [
  { label: 'Birthday Party Frocks', img: '/images/collections/Kids.webp' },
  { label: 'Wedding / Festive Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Reception / Evening Wear', img: '/images/collections/Pre-Teen.webp' },
  { label: 'Photoshoot Special Frocks', img: '/images/collections/Infant.webp' },
  { label: 'Princess / Fancy Dress', img: '/images/collections/newborn.avif' },
  { label: 'Casual Cotton Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Playtime Frocks', img: '/images/collections/Kids.webp' },
  { label: 'School Casual Frocks', img: '/images/collections/Little Girls.jpg' },
  { label: 'Summer Wear Frocks', img: '/images/collections/Toddler.webp' },
  { label: 'Comfortable Home Wear', img: '/images/collections/Infant.webp' },
];

export default function OccasionDailyWearFrocks() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();

  return (
    <div className="catpage-wrapper">
      <SEO 
        title="Occasion & Daily Wear Frocks"
        description="Premium frocks for every occasion – from birthday parties and weddings to comfortable daily and summer wear. Shop our handpicked kids collection."
        keywords="birthday party frocks, festive frocks, reception evening wear, daily wear frocks, summer frocks for kids, photoshoot special frocks"
        url="https://sumathitrends.com/collections/occasion-daily-wear-frocks"
      />


      <h1 className="catpage-title">Occasion &amp; Daily Wear Frocks</h1>
      <div className="catpage-divider" />

      <div className="catpage-grid">
        {subcategories.map((item) => (
          <div
            key={item.label}
            className="catpage-card"
            onClick={() => navigate('/collections', { state: { category: 'Occasion & Daily Wear Frocks', subcategory: item.label } })}
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
