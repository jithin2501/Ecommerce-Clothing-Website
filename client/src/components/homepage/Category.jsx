import { useNavigate } from 'react-router-dom';
import '../../styles/homepage/Category.css';

const categories = [
  {
    label: 'OCCASION & DAILY\nWEAR FROCKS',
    img: '/images/collections/newborn.avif',
    path: '/collections/occasion-daily-wear-frocks',
  },
  {
    label: 'PARTY WEAR\nCOLLECTION',
    img: '/images/collections/Kids.webp',
    path: '/collections/party-wear-collection',
  },
  {
    label: 'DESIGNER & PREMIUM\nFROCKS',
    img: '/images/collections/Pre-Teen.webp',
    path: '/collections/designer-premium-frocks',
  },
  {
    label: 'TRADITIONAL & ETHNIC\nFROCKS',
    img: '/images/collections/Kids.webp',
    path: '/collections/traditional-ethnic-frocks',
  },
  {
    label: 'FABRIC-BASED\nCATEGORIES',
    img: '/images/collections/infant.webp',
    path: '/collections/fabric-based-categories',
  },
];

export default function Category() {
  const navigate = useNavigate();

  return (
    <section id="collections" className="category-section">
      <div className="section-inner">

        <div className="category-header">
          <h2 className="category-title">
            <span>Shop By</span> Category
          </h2>
          <p className="category-subtitle">
            Discover beautiful styles for every occasion and every little moment.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="category-card"
              onClick={() => navigate(cat.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(cat.path)}
            >
              <div className="category-circle">
                <img src={cat.img} alt={cat.label} />
              </div>

              <span className="category-label">
                {cat.label.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>
                    {line}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
