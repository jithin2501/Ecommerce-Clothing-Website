import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/collections/YouMightAlsoLike.css';

const API = 'http://localhost:5000/api/products';

const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);

function FavoriteCard({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => typeof price === 'number' ? `₹${price}` : price;

  return (
    <div className="ymll-card">
      <div className="ymll-img-wrap">
        <img src={product.img} alt={product.name} />
        {product.age && <span className="ymll-age-badge">Ages {product.age}</span>}
        <button className="ymll-wish">♡</button>
      </div>
      <div className="ymll-card-info">
        <div className="ymll-top-row">
          <span className="ymll-category">{product.category}</span>
          <span className="ymll-price">{formatPrice(product.price)}</span>
        </div>
        <div className="ymll-name">{product.name}</div>
      </div>
      {!added ? (
        <button className="ymll-quick-add" onClick={() => { addToCart(product); setAdded(true); }}>
          <CartIcon /> Quick Add
        </button>
      ) : (
        <button className="ymll-quick-add ymll-go-to-cart" onClick={() => navigate('/cart')}>
          <CartIcon /> Go to Cart
        </button>
      )}
    </div>
  );
}

export default function YouMightAlsoLike() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/featured?section=currentFavorites`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.data); })
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="ymll-section">
      <div className="section-inner">
        <div className="ymll-header">
          <div>
            <h2 className="ymll-title">Current Favorites</h2>
            <p className="ymll-sub">The pieces everyone is loving this season</p>
          </div>
          <a href="#" className="ymll-view-all">View all bestsellers →</a>
        </div>
        <div className="ymll-grid">
          {products.map(p => <FavoriteCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}