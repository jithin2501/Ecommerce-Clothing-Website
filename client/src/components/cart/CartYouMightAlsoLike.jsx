import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/cart/CartYouMightAlsoLike.css';

const CartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
  </svg>
);

// Replace images with your actual src paths
const PRODUCTS = [
  { id: 101, name: 'Velvet Party Dress',    price: '$89.00',  age: 'AGES 0-2',  img: '/images/img1.webp', size: '2-3Y', color: 'velvet' },
  { id: 102, name: 'Quilted Winter Jacket', price: '$135.00', age: 'AGES 4-12', img: '/images/img2.webp', size: '4-5Y', color: 'navy'   },
  { id: 103, name: 'Classic Denim Jeans',   price: '$45.00',  age: 'AGES 1-8',  img: '/images/img3.webp', size: '2-3Y', color: 'blue'   },
  { id: 104, name: 'Soft Knit Cardigan',    price: '$68.00',  age: 'AGES 0-10', img: '/images/img1.webp', size: '4-5Y', color: 'cream'  },
];

function AlsoLikeCard({ product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
  };

  return (
    <div className="cyl-card">
      <div className="cyl-img-wrap">
        <img src={product.img} alt={product.name} />
        <span className="cyl-age">{product.age}</span>
        <button className="cyl-wish">♡</button>
      </div>
      <div className="cyl-info">
        <p className="cyl-name">{product.name}</p>
        <p className="cyl-price">{product.price}</p>
      </div>
      {!added ? (
        <button className="cyl-add-btn" onClick={handleAdd}>
          <CartIcon /> Quick Add
        </button>
      ) : (
        <button className="cyl-add-btn cyl-go-cart" onClick={() => navigate('/cart')}>
          <CartIcon /> Go to Cart
        </button>
      )}
    </div>
  );
}

export default function CartYouMightAlsoLike() {
  return (
    <section className="cyl-section">
      <h2 className="cyl-heading">YOU MIGHT ALSO LOVE</h2>
      <div className="cyl-grid">
        {PRODUCTS.map(p => <AlsoLikeCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
