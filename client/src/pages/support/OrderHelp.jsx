import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { useState } from 'react';
import '../../styles/support/SupportHub.css';

export default function OrderHelp() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || null;

  const [activeNav, setActiveNav]       = useState('');
  const [activeSubNav, setActiveSubNav] = useState('support');

  return (
    <div className="sh-page">
      <div className="sh-container">

        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          activeSubNav={activeSubNav}
          setActiveSubNav={setActiveSubNav}
        />

        <main className="sh-main">

          {/* Header */}
          <div className="sh-hero sh-hero--compact">
            <div className="sh-oh-breadcrumb">
              <span className="sh-bc-link" onClick={() => navigate('/support')}>Support Hub</span>
              <span className="sh-bc-sep">›</span>
              <span className="sh-bc-current">Order Help</span>
            </div>
            <div className="sh-mobile-header">
              <button className="mobile-back-btn" onClick={() => navigate('/support')}>
                <span className="back-chevron">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </span>
              </button>
              <h1 className="sh-hero-title">How can we help?</h1>
            </div>
            <p className="sh-hero-sub">We're here to sort things out quickly for you.</p>
          </div>

          <div className="sh-body sh-body--stretch">

            {/* Order info strip */}
            {order && (
              <div className="sh-oh-order-strip">
                <img src={order.image} alt={order.name} className="sh-order-img" />
                <div className="sh-order-info">
                  <div className="sh-order-label">ORDER #{order.id}</div>
                  <div className="sh-order-id">{order.name}</div>
                  <div className="sh-order-status">
                    Status: <span className="sh-status-delivered">{order.status}</span> on {order.date}
                  </div>
                </div>
              </div>
            )}

            {/* Still need help */}
            <section className="sh-still-section sh-still-section--stretch">
              <h2 className="sh-still-title">Need Help?</h2>
              <p className="sh-still-sub">
                Our dedicated team is ready to assist you with anything you need. Reach out through our priority channels.
              </p>
              <div className="sh-channels sh-channels--two">
                <div className="sh-channel-card" onClick={() => navigate('/support/chat', { state: { order } })} style={{cursor:'pointer'}}>
                  <div className="sh-channel-icon">💬</div>
                  <div>
                    <div className="sh-channel-title">Chat with us</div>
                    <div className="sh-channel-sub">Typical response time · 2 min</div>
                  </div>
                </div>
                <div className="sh-channel-card" onClick={() => window.location.href = 'mailto:sumathitrends.in@gmail.com'}>
                <div className="sh-channel-icon">✉️</div>
              <div>
                  <div className="sh-channel-title">Email us</div>
                  <div className="sh-channel-sub">sumathitrends.in@gmail.com</div>
              </div>
              </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
