import { useState } from 'react';
import '../../styles/collectiondetails/ProductRelated.css';

const RELATED = [
  {
    id: 1,
    name: 'Floral Midi Skirt',
    category: 'Dresses & Skirts',
    price: '$62.00',
    src: '/images/image1.png',
    colors: ['#C4A882', '#E8E0D5', '#8BA9C0'],
  },
  {
    id: 2,
    name: 'Linen Pinafore Dress',
    category: 'Dresses & Skirts',
    price: '$74.00',
    src: '/images/image2.png',
    colors: ['#C4A882', '#E8E0D5', '#8BA9C0'],
  },
  {
    id: 3,
    name: 'Smocked Sundress',
    category: 'Dresses & Skirts',
    price: '$68.00',
    src: '/images/image3.png',
    colors: ['#C4A882', '#E8E0D5', '#8BA9C0'],
  },
  {
    id: 4,
    name: 'Ruffle Hem Skirt',
    category: 'Dresses & Skirts',
    price: '$54.00',
    src: '/images/image1.png',
    colors: ['#C4A882', '#E8E0D5', '#8BA9C0'],
  },
];

function RelatedCard({ item }) {
  const [hovered, setHovered]   = useState(false);
  const [added, setAdded]       = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    setAdded(true);
  };

  const handleGoToCart = (e) => {
    e.preventDefault();
    // navigate to cart — wire up as needed
    window.location.href = '/cart';
  };

  return (
    <a
      href="#"
      className="prelat-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="prelat-img-wrap">
        <img src={item.src} alt={item.name} className="prelat-img" />
      </div>

      <div className="prelat-info">
        <span className="prelat-category">{item.category}</span>
        <span className="prelat-price">{item.price}</span>
      </div>
      <p className="prelat-name">{item.name}</p>

      <div className="prelat-colors">
        {item.colors.map((color, i) => (
          <span key={i} className="prelat-dot" style={{ background: color }} />
        ))}
      </div>

      {!added ? (
        <button
          className={`prelat-quick-add${hovered ? ' visible' : ''}`}
          onClick={handleQuickAdd}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Quick Add
        </button>
      ) : (
        <button
          className="prelat-go-to-cart visible"
          onClick={handleGoToCart}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
          </svg>
          Go to Cart
        </button>
      )}
    </a>
  );
}

export default function ProductRelated() {
  return (
    <section className="prelat-wrapper">
      <h2 className="prelat-heading">You might also like</h2>
      <div className="prelat-grid">
        {RELATED.map(item => (
          <RelatedCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}