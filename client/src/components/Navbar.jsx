import { ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const location  = useLocation();
  const { cartCount } = useCart();

  const pathParts    = location.pathname.split('/').filter(Boolean);
  const isBannerPage = pathParts.length <= 2 && location.pathname.startsWith('/collections');
  const isDetailPage = pathParts.length >= 3 && location.pathname.startsWith('/collections');

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(false);
    if (!isBannerPage && !isDetailPage) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navClass = [
    isBannerPage ? 'nav-collections' : '',
    isBannerPage && scrolled ? 'nav-scrolled' : '',
    isDetailPage && scrolled ? 'nav-scrolled nav-detail-scrolled' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass}>
      <div className="nav-inner">

        <Link to="/" className="logo-container">
          <div className="logo-img">
            <img src="images/logo.png" alt="Sumathi Trends" onError={(e) => { e.target.style.opacity = '0'; }} />
          </div>
          <div className="logo-text">Sumathi<br />Trends</div>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#about">About Us</a></li>
          <li><Link to="/collections">Collections</Link></li>
          <li><a href="#reviews">Review</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        <div className="nav-actions">
          <a href="#" className="action-item">
            <User size={18} />
            Account
          </a>
          <Link to="/cart" className="action-item">
            <div className="cart-wrapper">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
            Cart
          </Link>
        </div>

      </div>
    </nav>
  );
}