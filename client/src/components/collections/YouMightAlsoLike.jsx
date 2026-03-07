import { useState } from 'react';
import '../../styles/collections/YouMightAlsoLike.css';

const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);

const products = [
  { name: 'Quilted Heritage Jacket', price: '$64.00', category: 'Outwear',    img: '/images/img1.webp', colors: ['#5C6E4A', '#C8A882', '#3A5068'] },
  { name: 'Essentials Ribbed Set',   price: '$48.00', category: 'Essentials', img: '/images/img2.webp', colors: ['#C8B89A', '#E8DCC8', '#A8B8C8'] },
  { name: 'Everyday Denim Overalls', price: '$52.50', category: 'Playwear',   img: '/images/img3.webp', colors: ['#7EB8D4'] },
  { name: 'Soft Pointelle Cardigan', price: '$42.00', category: 'Knitwear',   img: '/images/img1.webp', colors: ['#E8C8A8', '#7EB8D4'] },
];

function FavoriteCard({ product }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="ymll-card">
      <div className="ymll-img-wrap">
        <img src={product.img} alt={product.name} />
      </div>

      <div className="ymll-card-info">
        <div className="ymll-top-row">
          <span className="ymll-category">{product.category}</span>
          <span className="ymll-price">{product.price}</span>
        </div>
        <div className="ymll-name">{product.name}</div>
        <div className="ymll-colors">
          {product.colors.map((color, ci) => (
            <span key={ci} className="ymll-color-dot" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      {!added ? (
        <button className="ymll-quick-add" onClick={() => setAdded(true)}>
          <CartIcon /> Quick Add
        </button>
      ) : (
        <button className="ymll-quick-add ymll-go-to-cart" onClick={() => window.location.href = '/cart'}>
          <CartIcon /> Go to Cart
        </button>
      )}
    </div>
  );
}

export default function YouMightAlsoLike() {
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
          {products.map((product, i) => (
            <FavoriteCard key={i} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}