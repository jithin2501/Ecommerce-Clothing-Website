import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="premium-footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <div className="logo-wrapper">
            <img
              src="./logo.png"
              alt="Sumathi Trends"
              className="brand-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="brand-name">Sumathi Trends</span>
          </div>
          <p className="brand-description">
            Elevating children's fashion through timeless design, premium
            materials, and exceptional craftsmanship since 2012.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="FB" />
            </a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="IG" />
            </a>
            <a href="https://wa.me/15551234567" className="social-icon" aria-label="WhatsApp">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WA" />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div className="footer-column">
          <h3>Collections</h3>
          <ul className="footer-links">
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Premium Basics</a></li>
            <li><a href="#">Occasion Wear</a></li>
            <li><a href="#" className="highlight">Seasonal Sale</a></li>
          </ul>
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

        {/* Our Store */}
        <div className="footer-column">
          <h3>Our Store</h3>
          <ul className="contact-info">
            <li>
              <div className="contact-item">
                <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="Location" />
                <span>123 Fifth Avenue,<br />New York, NY 10003</span>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <img src="https://cdn-icons-png.flaticon.com/512/455/455705.png" alt="Phone" />
                <span>+1 (555) 123-4567</span>
              </div>
            </li>
            <li>
              <div className="contact-item">
                <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" />
                <span>
                  <a href="mailto:hello@sumathitrenez.com">hello@sumathitrenez.com</a>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p>&copy; 2024 Sumathi Trends Kids' Fashion. All rights reserved.</p>
        <div className="legal-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
