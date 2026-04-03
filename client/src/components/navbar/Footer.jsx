import { Link } from 'react-router-dom';
import '../../styles/navbar/Footer.css';

export default function Footer() {
  return (
    <>
      <footer className="premium-footer">
        <div className="footer-content">

          {/* Brand */}
          <div className="footer-brand">
            <div className="logo-wrapper">
              <div className="footer-logo-img">
                <img
                  src="/images/logo/logo.png"
                  alt="Sumathi Trends"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="footer-logo-text">Sumathi Trends</div>
            </div>
            <p className="brand-description">
              Elevating children's fashion through timeless design, premium
              materials, and exceptional craftsmanship since 2026.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/14U8LwvzzXa/?mibextid=wwXIfr" className="social-icon" aria-label="Facebook">
                <img src="/images/icons/facebook.png" alt="FB" />
              </a>
              <a href="https://www.instagram.com/sumathitrends?igsh=MXE2OWtoeWNsZndz&utm_source=qr" className="social-icon" aria-label="Instagram">
                <img src="/images/icons/instagram.png" alt="IG" />
              </a>
              <a href="https://wa.me/918792888508" className="social-icon" aria-label="WhatsApp">
                <img src="/images/icons/social.png" alt="WA" />
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="footer-column">
            <h3>Useful Links</h3>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#category">Collections</a></li>
              <li><a href="#reviews">Reviews</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Category */}
          <div className="footer-column">
            <h3>Category</h3>
            <ul className="footer-links">
              <li><a href="#">Baby Frocks</a></li>
              <li><a href="#">Birthday Frocks</a></li>
              <li><a href="#">Tops &amp; T-Shirts</a></li>
              <li><a href="#">Indo-Western Outfits</a></li>
              <li><a href="#">Traditional Outfits</a></li>
              <li><a href="#">Party Wear</a></li>
              <li><a href="#">Boys Collection</a></li>
            </ul>
          </div>

          {/* Our Store */}
          <div className="footer-column">
            <h3>Our Store</h3>
            <ul className="contact-info">
              <li>
                <div className="contact-item">
                  <div className="contact-icon-circle">
                    <img src="/images/icons/map.png" alt="Location" />
                  </div>
                  <span>No.52, Saxena complex, Kodigehalli Main Rd,<br />Defence Layout, Sahakar Nagar,<br />Bengaluru, Karnataka 560092</span>
                </div>
              </li>
              <li>
                <div className="contact-item contact-item-center">
                  <div className="contact-icon-circle">
                    <img src="/images/icons/phone.png" alt="Phone" />
                  </div>
                  <span>+91 87928 88508</span>
                </div>
              </li>
              <li>
                <div className="contact-item contact-item-center">
                  <div className="contact-icon-circle">
                    <img src="/images/icons/gmail.png" alt="Email" />
                  </div>
                  <span>
                    <a href="mailto:sumathitrends.in@gmail.com">sumathitrends.in@gmail.com</a>
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>&copy; 2026 Sumathi Trends. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/account/policy/privacy" className="legal-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
              Privacy Policy
            </Link>
            <Link to="/account/policy/terms" className="legal-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
              Terms of Service
            </Link>
            <Link to="/account/policy/refund" className="legal-link-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
              Refund &amp; Cancellation Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}