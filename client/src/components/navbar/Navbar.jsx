import { ShoppingCart, User, LogIn, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Note: Ensure these paths match your actual project structure
import { auth } from '../../firebase';
import { useCart } from '../../context/CartContext';
import '../../styles/navbar/Navbar.css';

/**
 * Helper to handle smooth scrolling to sections on the homepage
 */
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
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const prevPathRef = useRef(location.pathname);

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Fixes the Login -> Account flash
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const isBannerPage = pathParts.length <= 2 && location.pathname.startsWith('/collections');
  const isContactPage = location.pathname === '/contact';
  const isFixedBanner = isBannerPage || isContactPage;

  // ── Listen to Firebase auth state ──────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // Auth confirmed, stop showing loading state
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

  // ── Home scroll restoration ────────────────────────────────
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

  // ── Navigation Handlers ────────────────────────────────────
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
    setIsSidebarOpen(false);
    if (location.pathname !== '/') {
      sessionStorage.setItem('scrollTarget', sectionId);
      navigate('/');
    } else {
      scrollToSection(sectionId);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
            <img src="/images/logo/logo.png" alt="Sumathi Trends" onError={(e) => { e.target.style.opacity = '0'; }} />
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

          {/* ── AUTH SECTION ── */}
          {!loading && (
            user ? (
              <div className="account-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="action-item"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="icon-wrapper">
                    <User size={18} />
                  </div>
                  <span>ACCOUNT</span>
                </button>

                {showDropdown && (
                  <div className="account-dropdown">
                    <div className="dropdown-user-info">
                      <p className="dropdown-name">{user.displayName || 'User'}</p>
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
              <Link to="/login" className="action-item">
                <div className="icon-wrapper">
                  <LogIn size={18} />
                </div>
                <span>LOGIN</span>
              </Link>
            )
          )}

          {/* ── CART ── */}
          <Link to="/cart" className="action-item">
            <div className="icon-wrapper">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
            <span>CART</span>
          </Link>

        </div>

        {/* ── HAMBURGER BUTTON ── */}
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <Menu size={28} />
        </button>
      </div>

      {/* ── MOBILE SIDEBAR ── */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-links">
            <li><a href="/" onClick={(e) => { handleHome(e); setIsSidebarOpen(false); }}>Home</a></li>
            <li><a href="#about" onClick={(e) => handleSection(e, 'about')}>About Us</a></li>
            <li><Link to="/collections" onClick={() => setIsSidebarOpen(false)}>Collections</Link></li>
            <li><a href="#reviews" onClick={(e) => handleSection(e, 'reviews')}>Review</a></li>
            <li><Link to="/contact" onClick={() => setIsSidebarOpen(false)}>Contact</Link></li>
          </ul>

          <div className="sidebar-actions">
            {!loading && (
              user ? (
                <>
                  <div className="sidebar-user-info">
                    <p className="sidebar-name">{user.displayName || 'User'}</p>
                    <p className="sidebar-email">{user.email}</p>
                  </div>
                  <Link to="/account" className="sidebar-action-item" onClick={() => setIsSidebarOpen(false)}>
                    <User size={20} />
                    <span>My Account</span>
                  </Link>
                  <button className="sidebar-action-item sidebar-logout" onClick={() => { handleLogout(); setIsSidebarOpen(false); }}>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="sidebar-action-item" onClick={() => setIsSidebarOpen(false)}>
                  <LogIn size={20} />
                  <span>Login / Register</span>
                </Link>
              )
            )}

            <Link to="/cart" className="sidebar-action-item" onClick={() => setIsSidebarOpen(false)}>
              <div className="sidebar-icon-wrapper">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="sidebar-cart-count">{cartCount}</span>}
              </div>
              <span>Shopping Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
