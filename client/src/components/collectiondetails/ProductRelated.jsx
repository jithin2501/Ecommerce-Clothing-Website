import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/collectiondetails/ProductRelated.css';

const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
  </svg>
);

const RELATED = [
  { id: 1, name: 'Floral Midi Skirt',    category: 'Dresses & Skirts', price: '$62.00', age: 'AGES 0-2',  src: '/images/image1.png', colors: ['#C4A882', '#E8E0D5', '#8BA9C0'] },
  { id: 2, name: 'Linen Pinafore Dress', category: 'Dresses & Skirts', price: '$74.00', age: 'AGES 3-5',  src: '/images/image2.png', colors: ['#C4A882', '#E8E0D5', '#8BA9C0'] },
  { id: 3, name: 'Smocked Sundress',     category: 'Dresses & Skirts', price: '$68.00', age: 'AGES 4-12', src: '/images/image3.png', colors: ['#C4A882', '#E8E0D5', '#8BA9C0'] },
  { id: 4, name: 'Ruffle Hem Skirt',     category: 'Dresses & Skirts', price: '$54.00', age: 'AGES 0-10', src: '/images/image1.png', colors: ['#C4A882', '#E8E0D5', '#8BA9C0'] },
];

function RelatedCard({ item }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addToCart({ ...item, id: item.id, size: 'default', color: 'default' });
    setAdded(true);
  };

  return (
    <div className="prelat-card">
      <div className="prelat-img-wrap">
        <img src={item.src} alt={item.name} className="prelat-img" />
        <span className="prelat-age">{item.age}</span>
        <button className="prelat-wish">♡</button>
      </div>
      <div className="prelat-info">
        <div className="prelat-top-row">
          <span className="prelat-category">{item.category}</span>
          <span className="prelat-price">{item.price}</span>
        </div>
        <p className="prelat-name">{item.name}</p>
        <div className="prelat-colors">
          {item.colors.map((c, i) => (
            <span key={i} className="prelat-dot" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      {!added ? (
        <button className="prelat-btn" onClick={handleAdd}>
          <CartIcon /> Quick Add
        </button>
      ) : (
        <button className="prelat-btn prelat-btn-cart" onClick={() => navigate('/cart')}>
          <CartIcon /> Go to Cart
        </button>
      )}
    </div>
  );
}

export default function ProductRelated() {
  return (
    <section className="prelat-wrapper">
      <h2 className="prelat-heading">YOU MIGHT ALSO LIKE</h2>
      <div className="prelat-grid">
        {RELATED.map(item => <RelatedCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}