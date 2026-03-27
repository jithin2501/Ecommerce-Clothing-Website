import { ShoppingCart, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import '../../styles/navbar/Navbar.css';

function scrollToSection(sectionId) {
  let attempts = 0;
  const maxAttempts = 60;

  const tryScroll = () => {
    const el = document.getElementById(sectionId);
    if (el && el.getBoundingClientRect().height > 0) {
      const navEl = document.querySelector('nav');
      const navHeight = navEl ? navEl.getBoundingClientRect().height : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(tryScroll, 50);
    }
  };

  requestAnimationFrame(tryScroll);
}

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { cartCount } = useCart();
  // Track previous pathname so we know when we've just arrived at '/'
  const prevPathRef = useRef(location.pathname);

  const pathParts     = location.pathname.split('/').filter(Boolean);
  const isBannerPage  = pathParts.length <= 2 && location.pathname.startsWith('/collections');
  const isContactPage = location.pathname === '/contact';
  const isFixedBanner = isBannerPage || isContactPage;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(false);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const wasElsewhere = prevPathRef.current !== '/';
    prevPathRef.current = location.pathname;

    if (location.pathname !== '/') return;

    // Case 1: returning from product page (breadcrumb OR browser back)
    if (sessionStorage.getItem('restoreHomeScroll') === '1') {
      sessionStorage.removeItem('restoreHomeScroll');
      const sectionId = sessionStorage.getItem('restoreToSection');
      sessionStorage.removeItem('restoreToSection');
      if (sectionId) {
        // Hide the page instantly, scroll, then reveal — eliminates the 1s flash
        document.documentElement.style.visibility = 'hidden';
        const reveal = () => {
          document.documentElement.style.visibility = '';
        };

        let attempts = 0;
        const maxAttempts = 60;
        const tryScroll = () => {
          const el = document.getElementById(sectionId);
          if (el && el.getBoundingClientRect().height > 0) {
            const navEl = document.querySelector('nav');
            const navHeight = navEl ? navEl.getBoundingClientRect().height : 80;
            const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
            reveal();
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(tryScroll, 50);
          } else {
            reveal(); // safety: always reveal
          }
        };
        requestAnimationFrame(tryScroll);
      }
      return;
    }

    // Case 2: navigating to a named section from another page
    const hash = sessionStorage.getItem('scrollTarget');
    if (hash) {
      sessionStorage.removeItem('scrollTarget');
      scrollToSection(hash);
      return;
    }

    // Case 3: explicit "go home to top"
    if (sessionStorage.getItem('goHome') === '1') {
      sessionStorage.removeItem('goHome');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  const handleHome = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('scrollTarget');
    sessionStorage.removeItem('restoreHomeScroll');
    sessionStorage.removeItem('restoreToSection');
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
      scrollToSection(sectionId);
    }
  };

  let navClass = '';
  if (isFixedBanner) {
    navClass = scrolled ? 'nav-banner-scrolled' : 'nav-collections';
  } else if (scrolled) {
    navClass = 'nav-detail-scrolled';
  }

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
          <Link to="/account" className="action-item">
            <User size={18} />
            Account
          </Link>
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