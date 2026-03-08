import { ShoppingCart, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { cartCount } = useCart();

  const pathParts    = location.pathname.split('/').filter(Boolean);
  const isBannerPage = pathParts.length <= 2 && location.pathname.startsWith('/collections');
  const isDetailPage = pathParts.length >= 3 && location.pathname.startsWith('/collections');
  const isContactPage = location.pathname === '/contact';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(false);
    if (!isBannerPage && !isDetailPage && !isContactPage) return;
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const hash = sessionStorage.getItem('scrollTarget');
    if (!hash) return;
    if (location.pathname === '/') {
      sessionStorage.removeItem('scrollTarget');
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (sessionStorage.getItem('goHome') === '1' && location.pathname === '/') {
      sessionStorage.removeItem('goHome');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  const handleHome = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('scrollTarget');
    if (location.pathname !== '/') {
      sessionStorage.setItem('goHome', '1');
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      sessionStorage.setItem('scrollTarget', sectionId);
      navigate('/');
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  };

  const navClass = [
    isBannerPage ? 'nav-collections' : '',
    isBannerPage && scrolled ? 'nav-scrolled' : '',
    isDetailPage && scrolled ? 'nav-scrolled nav-detail-scrolled' : '',
    isContactPage && scrolled ? 'nav-contact-scrolled' : '',
  ].filter(Boolean).join(' ');

  return (
    <nav className={navClass}>
      <div className="nav-inner">

        <Link to="/" className="logo-container" onClick={handleHome}>
          <div className="logo-img">
            <img src="images/logo.png" alt="Sumathi Trends" onError={(e) => { e.target.style.opacity = '0'; }} />
          </div>
          <div className="logo-text">Sumathi<br />Trends</div>
        </Link>

        <ul className="nav-links">
          <li><a href="/" onClick={handleHome}>Home</a></li>
          <li><a href="#about" onClick={(e) => handleSection(e, 'about')}>About Us</a></li>
          <li><Link to="/collections">Collections</Link></li>
          <li><a href="#reviews" onClick={(e) => handleSection(e, 'reviews')}>Review</a></li>
          <li><Link to="/contact">Contact</Link></li>
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