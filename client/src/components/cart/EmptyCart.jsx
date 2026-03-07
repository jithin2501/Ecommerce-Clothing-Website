import { Link } from 'react-router-dom';
import '../../styles/cart/EmptyCart.css';

export default function EmptyCart() {
  return (
    <div className="ec-page">
      <div className="ec-inner">
        <div className="ec-icon-wrap">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
            <line x1="4" y1="4" x2="20" y2="20" stroke="#C17B5C" strokeWidth="1.5"/>
          </svg>
          <span className="ec-sad">☹</span>
        </div>
        <h2 className="ec-title">Your shopping bag is empty</h2>
        <p className="ec-sub">It looks like you haven't added any items to your cart yet. Explore our latest collections for your little ones.</p>
        <Link to="/collections" className="ec-btn">CONTINUE SHOPPING →</Link>
      </div>
    </div>
  );
}
