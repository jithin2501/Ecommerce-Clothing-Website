import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/collectiondetails/ProductRelated.css';

const API = 'http://localhost:5000/api/products';

const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
  </svg>
);

function RelatedCard({ item }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => typeof price === 'number' ? `₹${price}` : price;

  return (
    <div className="prelat-card">
      <div className="prelat-img-wrap">
        <img src={item.img} alt={item.name} className="prelat-img" />
        {item.age && <span className="prelat-age">Ages {item.age}</span>}
        <button className="prelat-wish">♡</button>
      </div>
      <div className="prelat-info">
        <div className="prelat-top-row">
          <span className="prelat-category">{item.category}</span>
          <span className="prelat-price">{formatPrice(item.price)}</span>
        </div>
        <p className="prelat-name">{item.name}</p>
      </div>
      {!added ? (
        <button className="prelat-btn" onClick={() => { addToCart(item); setAdded(true); }}>
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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/featured?section=youMightAlsoLike`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.data); })
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="prelat-wrapper">
      <h2 className="prelat-heading">YOU MIGHT ALSO LIKE</h2>
      <div className="prelat-grid">
        {products.map(item => <RelatedCard key={item._id} item={item} />)}
      </div>
    </section>
  );
}