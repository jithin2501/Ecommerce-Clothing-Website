import { ShoppingCart, User, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
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
  const location    = useLocation();
  const navigate    = useNavigate();
  const { cartCount } = useCart();
  const prevPathRef = useRef(location.pathname);

  const [scrolled, setScrolled]   = useState(false);
  const [user, setUser]           = useState(null);      // Firebase user
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const pathParts     = location.pathname.split('/').filter(Boolean);
  const isBannerPage  = pathParts.length <= 2 && location.pathname.startsWith('/collections');
  const isContactPage = location.pathname === '/contact';
  const isFixedBanner = isBannerPage || isContactPage;

  // ── Listen to Firebase auth state ──────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // ── Close dropdown when clicking outside ───────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Scroll handling ────────────────────────────────────────
  useEffect(() => {
    setScrolled(false);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    prevPathRef.current = location.pathname;
    if (location.pathname !== '/') return;

    if (sessionStorage.getItem('restoreHomeScroll') === '1') {
      sessionStorage.removeItem('restoreHomeScroll');
      const sectionId = sessionStorage.getItem('restoreToSection');
      sessionStorage.removeItem('restoreToSection');
      if (sectionId) {
        document.documentElement.style.visibility = 'hidden';
        const reveal = () => { document.documentElement.style.visibility = ''; };
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
            reveal();
          }
        };
        requestAnimationFrame(tryScroll);
      }
      return;
    }

    const hash = sessionStorage.getItem('scrollTarget');
    if (hash) {
      sessionStorage.removeItem('scrollTarget');
      scrollToSection(hash);
      return;
    }

    if (sessionStorage.getItem('goHome') === '1') {
      sessionStorage.removeItem('goHome');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  // ── Handlers ───────────────────────────────────────────────
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

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
    navigate('/');
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

          {/* ── LOGIN / ACCOUNT toggle ── */}
          {user ? (
            // User is logged in → show Account with dropdown
            <div className="account-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="action-item account-btn"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="nav-avatar" />
                ) : (
                  <User size={18} />
                )}
                Account
              </button>

              {showDropdown && (
                <div className="account-dropdown">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user.displayName}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/account" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    My Account
                  </Link>
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User is NOT logged in → show Login
            <Link to="/login" className="action-item">
              <LogIn size={18} />
              Login
            </Link>
          )}

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