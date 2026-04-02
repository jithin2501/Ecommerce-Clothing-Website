import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/cart/CartYouMightAlsoLike.css';

const API = '/api/products';

const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
  </svg>
);

function AlsoLikeCard({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => typeof price === 'number' ? `₹${price}` : price;

  const handleCardClick = () => {
    // Save that we came from the cart page — restore to top of cart on back
    sessionStorage.setItem('restoreCartScroll', '1');
    navigate(`/collections/product/${product._id}`, {
      state: {
        fromLabel: 'Cart',
        fromCart: true,
        restoreScroll: true,
      },
    });
  };

  return (
    <div className="cyl-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="cyl-img-wrap">
        <img src={product.img} alt={product.name} />
        {product.age && <span className="cyl-age">Ages {product.age}</span>}
        <button className="cyl-wish" onClick={(e) => e.stopPropagation()}>♡</button>
      </div>
      <div className="cyl-info">
        <div className="cyl-top-row">
          <span className="cyl-category">{product.category}</span>
          <span className="cyl-price">{formatPrice(product.price)}</span>
        </div>
        <div className="cyl-name">{product.name}</div>
      </div>
      {!added ? (
        <button className="cyl-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); setAdded(true); }}>
          <CartIcon /> Quick Add
        </button>
      ) : (
        <button className="cyl-add-btn cyl-go-cart" onClick={(e) => { e.stopPropagation(); navigate('/cart'); }}>
          <CartIcon /> Go to Cart
        </button>
      )}
    </div>
  );
}

export default function CartYouMightAlsoLike() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/featured?section=cartAlsoLike`)
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.data); })
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="cyl-section">
      <h2 className="cyl-heading">YOU MIGHT ALSO LOVE</h2>
      <div className="cyl-grid">
        {products.map(p => <AlsoLikeCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
