import { ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  // Transparent nav only on collections listing and age group pages (not detail pages)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isCollections = pathParts.length <= 2 && location.pathname.startsWith('/collections');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isCollections) return;

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCollections]);

  const navClass = [
    'nav-root',
    isCollections ? 'nav-collections' : '',
    isCollections && scrolled ? 'nav-scrolled' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass}>
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