import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/support/SupportHub.css';

const recentOrders = [
  {
    id: 'PP-82934',
    name: 'Organic Cotton Romper',
    status: 'Delivered',
    date: 'Oct 12, 2023',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=80&h=80&fit=crop',
  },
  {
    id: 'PP-71823',
    name: 'Premium Wool Cardigan',
    status: 'Delivered',
    date: 'Nov 10, 2023',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=80&h=80&fit=crop',
  },
  {
    id: 'PP-63491',
    name: 'Essential Linen Shirt',
    status: 'Delivered',
    date: 'Sep 11, 2023',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop',
  },
  {
    id: 'PP-55820',
    name: 'Classic Velvet Party Dress',
    status: 'Delivered',
    date: 'Dec 01, 2023',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=80&h=80&fit=crop',
  },
];

export default function SupportHub() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
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

          {/* Hero Banner */}
          <div className="sh-hero">
            <h1 className="sh-hero-title">Sumathi Trends Support Hub</h1>
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
              <div className="sh-orders-list">
                {recentOrders.map((order, i) => (
                  <div key={order.id} className="sh-order-card">

                    <img src={order.image} alt={order.name} className="sh-order-img" />
                    <div className="sh-order-info">
                      <div className="sh-order-label">ORDER #{order.id}</div>
                      <div className="sh-order-id">{order.name}</div>
                      <div className="sh-order-status">
                        Status: <span className="sh-status-delivered">{order.status}</span> on {order.date}
                      </div>
                    </div>
                    <button
                      className="sh-need-help-btn"
                      onClick={() => navigate('/support/order-help', { state: { order } })}
                    >
                      Need help? ›
                    </button>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}