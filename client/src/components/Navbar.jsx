import { ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav>
      <div className="nav-inner">

        {/* Logo */}
        <Link to="/" className="logo-container">
          <div className="logo-img">
            <img
              src="images/logo.png"
              alt="Sumathi Trends"
              onError={(e) => { e.target.style.opacity = '0'; }}
            />
          </div>
          <div className="logo-text">
            Sumathi<br />Trends
          </div>
        </Link>

        {/* Nav Links */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#about">About Us</a></li>
          <li><Link to="/collections">Collections</Link></li>
          <li><a href="#reviews">Review</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <a href="#" className="action-item">
            <User size={18} />
            Account
          </a>
          <a href="#" className="action-item">
            <div className="cart-wrapper">
              <ShoppingCart size={18} />
              <span className="cart-count">2</span>
            </div>
            Cart
          </a>
        </div>

      </div>
    </nav>
  );
}