import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/collectiondetails/ProductRelated.css';

const API = '/api/products';

const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
  </svg>
);

function RelatedCard({ item }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const productId = item._id || item.id;
  const active = isWishlisted(productId);

  const formatPrice = (price) => typeof price === 'number' ? `₹${price}` : price;

  const handleCardClick = () => {
    navigate(`/collections/product/${item._id}`, {
      state: {
        fromLabel: 'You Might Also Like',
        restoreScroll: false,
      },
    });
  };

  return (
    <div className="prelat-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="prelat-img-wrap">
        <img src={item.img} alt={item.name} className="prelat-img" />
        {item.stock <= 0 && (
          <div className="prelat-sold-overlay" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.3)', color: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem',
            borderRadius: '10px'
          }}>
            Sold
          </div>
        )}
        {item.age && <span className="prelat-age">AGE {item.age.replace(/Months?/ig, 'M').replace(/Years?/ig, 'Y')}</span>}
        <button 
          className={`prelat-wish${active ? ' active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist({ ...item, id: productId }); }}
          style={{ color: active ? '#e11d48' : 'inherit' }}
        >
          {active ? '♥' : '♡'}
        </button>
      </div>
      <div className="prelat-info">
        <div className="prelat-top-row">
          <span className="prelat-category">{item.category}</span>
          <span className="prelat-price">{formatPrice(item.price)}</span>
        </div>
        <p className="prelat-name">{item.name}</p>
      </div>
      {!added ? (
        <button 
          className="prelat-btn" 
          onClick={(e) => { e.stopPropagation(); addToCart(item); setAdded(true); }}
          disabled={item.stock <= 0}
          style={item.stock <= 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          <CartIcon /> {item.stock <= 0 ? 'Out of Stock' : 'Quick Add'}
        </button>
      ) : (
        <button className="prelat-btn prelat-btn-cart" onClick={(e) => { e.stopPropagation(); navigate('/cart'); }}>
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
