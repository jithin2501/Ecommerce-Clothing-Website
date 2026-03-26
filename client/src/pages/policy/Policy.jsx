import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/policy/Policy.css';

// ─── Privacy Policy ───────────────────────────────────────────────────────────

function PrivacyPolicyContent() {
  return (
    <div className="policy-page-body">
      <p className="policy-page-intro">
        This Privacy Policy describes how Sumathi Trends ("we", "our", "us") collects, uses, and
        protects your information when you use our website.
      </p>
      <section>
        <h3>1. Information We Collect</h3>
        <p>We may collect the following information:</p>
        <ul>
          <li>Name, email address, phone number</li>
          <li>Shipping and billing address</li>
          <li>Payment details (processed securely via third-party payment providers)</li>
          <li>Device and browsing information</li>
        </ul>
      </section>
      <section>
        <h3>2. How We Use Your Information</h3>
        <p>We use your information to:</p>
        <ul>
          <li>Process and deliver orders</li>
          <li>Communicate with you regarding your order</li>
          <li>Improve our services and website</li>
          <li>Prevent fraudulent transactions</li>
        </ul>
      </section>
      <section>
        <h3>3. Payment Information</h3>
        <p>
          We do not store your card or payment details. Payments are securely processed through
          trusted third-party payment gateways.
        </p>
      </section>
      <section>
        <h3>4. Data Sharing</h3>
        <p>We do not sell or rent your personal data. Information may be shared with:</p>
        <ul>
          <li>Payment providers</li>
          <li>Shipping partners</li>
          <li>Legal authorities (if required)</li>
        </ul>
      </section>
      <section>
        <h3>5. Cookies</h3>
        <p>We may use cookies to enhance your browsing experience and analyze website traffic.</p>
      </section>
      <section>
        <h3>6. Data Security</h3>
        <p>We implement reasonable security measures to protect your personal data.</p>
      </section>
      <section>
        <h3>7. Your Rights</h3>
        <p>You may contact us to:</p>
        <ul>
          <li>Access your data</li>
          <li>Request corrections</li>
          <li>Request deletion (subject to legal obligations)</li>
        </ul>
      </section>
      <section>
        <h3>8. Changes to Policy</h3>
        <p>We may update this policy at any time without prior notice.</p>
      </section>
      <section>
        <h3>9. Contact Us</h3>
        <p>For any questions, contact us at:</p>
        <ul>
          <li>Email: <a href="mailto:sumathitrends.in@gmail.com">sumathitrends.in@gmail.com</a></li>
          <li>Phone: +91 87928 88508</li>
          <li>
            Address: No.52, Saxena complex, Kodigehalli Main Rd, Defence Layout,
            Sahakar Nagar, Bengaluru, Karnataka 560092
          </li>
        </ul>
      </section>
    </div>
  );
}

// ─── Terms & Conditions ───────────────────────────────────────────────────────

function TermsConditionsContent() {
  return (
    <div className="policy-page-body">
      <p className="policy-page-intro">
        By using this website, you agree to the following terms:
      </p>
      <section>
        <h3>1. General</h3>
        <p>
          Sumathi Trends operates this website. By accessing it, you agree to be bound by these terms.
        </p>
      </section>
      <section>
        <h3>2. Products &amp; Services</h3>
        <p>
          We strive to ensure all product details and prices are accurate. However, errors may
          occur and we reserve the right to correct them.
        </p>
      </section>
      <section>
        <h3>3. Orders</h3>
        <ul>
          <li>All orders are subject to availability and acceptance</li>
          <li>We reserve the right to cancel any order due to unforeseen issues</li>
        </ul>
      </section>
      <section>
        <h3>4. Pricing</h3>
        <p>Prices are subject to change without prior notice.</p>
      </section>
      <section>
        <h3>5. Payments</h3>
        <p>
          All payments must be made in full at the time of purchase through available payment methods.
        </p>
      </section>
      <section>
        <h3>6. Shipping</h3>
        <p>
          Delivery timelines are estimates and may vary depending on location and external factors.
        </p>
      </section>
      <section>
        <h3>7. No Cancellation &amp; No Refund Policy</h3>
        <p>All purchases made on our website are final.</p>
        <ul>
          <li>Orders cannot be cancelled once placed</li>
          <li>No refunds will be provided under any circumstances</li>
        </ul>
      </section>
      <section>
        <h3>8. Limitation of Liability</h3>
        <p>We are not responsible for:</p>
        <ul>
          <li>Delays in delivery</li>
          <li>Indirect or incidental damages</li>
        </ul>
      </section>
      <section>
        <h3>9. Intellectual Property</h3>
        <p>
          All content on this website is owned by Sumathi Trends and cannot be used without permission.
        </p>
      </section>
      <section>
        <h3>10. Governing Law</h3>
        <p>These terms are governed by the laws of India.</p>
      </section>
      <section>
        <h3>11. Contact</h3>
        <ul>
          <li>Email: <a href="mailto:sumathitrends.in@gmail.com">sumathitrends.in@gmail.com</a></li>
          <li>Phone: +91 87928 88508</li>
        </ul>
      </section>
    </div>
  );
}

// ─── Refund & Cancellation ────────────────────────────────────────────────────

function RefundPolicyContent() {
  return (
    <div className="policy-page-body">
      <p className="policy-page-intro">
        At Sumathi Trends, we maintain a strict{' '}
        <strong>No Refund and No Cancellation Policy</strong>.
      </p>
      <section>
        <h3>1. No Cancellation</h3>
        <p>Once an order is placed, it cannot be cancelled under any circumstances.</p>
      </section>
      <section>
        <h3>2. No Refund</h3>
        <p>
          We do not offer refunds for any products or services once the order is confirmed.
        </p>
      </section>
      <section>
        <h3>3. Exceptions</h3>
        <p>Refunds or replacements will only be considered in the following cases:</p>
        <ul>
          <li>Wrong product delivered</li>
          <li>Damaged product (proof required within 24 hours of delivery)</li>
        </ul>
        <p>In such cases, customers must contact us immediately with proper evidence.</p>
      </section>
      <section>
        <h3>4. Replacement Policy</h3>
        <p>If eligible, replacement will be processed instead of a refund.</p>
      </section>
      <section>
        <h3>5. Contact for Issues</h3>
        <p>For any issues, contact us within 24 hours of delivery:</p>
        <ul>
          <li>Email: <a href="mailto:sumathitrends.in@gmail.com">sumathitrends.in@gmail.com</a></li>
          <li>Phone: +91 87928 88508</li>
        </ul>
      </section>
      <section>
        <h3>6. Policy Updates</h3>
        <p>
          We reserve the right to modify this policy at any time without prior notice.
        </p>
      </section>
    </div>
  );
}

// ─── Meta map ─────────────────────────────────────────────────────────────────

const POLICY_META = {
  privacy: {
    title:    'Privacy Policy',
    subtitle: 'How we collect and protect your data',
    content:  <PrivacyPolicyContent />,
  },
  terms: {
    title:    'Terms of Service',
    subtitle: 'Rules and guidelines for using our website',
    content:  <TermsConditionsContent />,
  },
  refund: {
    title:    'Refund & Cancellation Policy',
    subtitle: 'Our policy on returns and order cancellations',
    content:  <RefundPolicyContent />,
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Policy() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  // useParams reads  /account/policy/:type  → type = 'privacy' | 'terms' | 'refund'
  const { type } = useParams();
  const meta = POLICY_META[type] || POLICY_META.privacy;

  // Keep sidebar highlight in sync with the current route
  const [activeNav, setActiveNav]       = useState('policy');
  const [activeSubNav, setActiveSubNav] = useState(type || 'privacy');

  // If the URL param changes (browser back/forward), sync local state
  useEffect(() => {
    setActiveNav('policy');
    setActiveSubNav(type || 'privacy');
  }, [type]);

  return (
    <div className="policy-page">
      <div className="policy-container">

        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          activeSubNav={activeSubNav}
          setActiveSubNav={setActiveSubNav}
        />

        <main className="policy-main">
          <div className="policy-content-header">
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
          <div className="policy-card">
            {meta.content}
          </div>
        </main>

      </div>
    </div>
  );
}