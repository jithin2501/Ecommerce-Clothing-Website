import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../../styles/support/SupportHub.css';

const API = '/api';

export default function SupportHub() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const [search, setSearch] = useState('');
  const [activeNav, setActiveNav]       = useState('');
  const [activeSubNav, setActiveSubNav] = useState('support');
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const res = await fetch(`${API}/payment/user-orders/${fbUser.uid}`);
          const data = await res.json();
          if (data.success) {
            // Filter only delivered orders for the support hub help section
            const delivered = data.data.filter(o => o.trackingStatus?.toLowerCase() === 'delivered');
            setOrders(delivered);
          }
        } catch (err) {
          console.error("SupportHub: Failed to fetch orders", err);
        }
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

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

          {/* Hero Banner */}
          <div className="sh-hero">
            <div className="sh-mobile-header">
              <button className="mobile-back-btn" onClick={() => navigate('/account')}>
                <span className="back-chevron">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </span>
              </button>
              <h1 className="sh-hero-title">Sumathi Trends Support Hub</h1>
            </div>
            <p className="sh-hero-sub">Experience seamless assistance for your little one's wardrobe.</p>
            <div className="sh-search-wrap">
              <span className="sh-search-icon">🔍</span>
              <input
                className="sh-search-input"
                placeholder="Search order using order ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="sh-search-btn">Search</button>
            </div>
          </div>

          <div className="sh-body">

            {/* Recent Orders */}
            <section className="sh-section">
              <h2 className="sh-section-title">Help with recent orders</h2>
              <div className="sh-orders-scroll-container">
                <div className="sh-orders-list">
                  {loading ? (
                    <p style={{textAlign:'center', padding:'20px', color:'#888'}}>Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p style={{textAlign:'center', padding:'20px', color:'#888'}}>No delivered orders found.</p>
                  ) : (
                    orders.map((order) => {
                      const firstItem = order.items?.[0];
                      const itemName = firstItem?.name || 'Order Item';
                      const extraCount = (order.items?.length || 0) - 1;
                      const displayTitle = extraCount > 0 ? `${itemName} + ${extraCount} more` : itemName;
                      
                      return (
                        <div key={order._id} className="sh-order-card">
                          <img 
                            src={firstItem?.image || firstItem?.img || firstItem?.photo || '/logo.png'} 
                            alt={itemName} 
                            className="sh-order-img" 
                          />
                          <div className="sh-order-info">
                            <div className="sh-order-label">ORDER #{order.displayId}</div>
                            <div className="sh-order-id">{displayTitle}</div>
                            <div className="sh-order-status">
                              Status: <span className="sh-status-delivered">{order.trackingStatus}</span>
                            </div>
                          </div>
                          <button
                            className="sh-need-help-btn"
                            onClick={() => navigate('/support/order-help', { state: { order } })}
                          >
                            Need help?
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

             {/* Still need help */}
             <section className="sh-still-section">
              <h2 className="sh-still-title">Still need help?</h2>
              <p className="sh-still-sub">
                Our dedicated team is ready to assist you with anything you need.
              </p>
              <div className="sh-channels sh-channels--two">
                <div className="sh-channel-card" onClick={() => navigate('/support/chat')} style={{cursor:'pointer'}}>
                  <div className="sh-channel-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="sh-channel-title">Chat with us</div>
                    <div className="sh-channel-sub">Typical response time · 2 min</div>
                  </div>
                </div>
                <div className="sh-channel-card" onClick={() => window.location.href = 'mailto:sumathitrends.in@gmail.com'}>
                  <div className="sh-channel-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
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
