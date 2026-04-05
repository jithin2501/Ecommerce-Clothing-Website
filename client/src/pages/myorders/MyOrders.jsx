import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/myorders/MyOrders.css';

const orders = [
  {
    id: 1,
    name: 'Organic Cotton Romper - 3 Items',
    color: 'Sage Green',
    size: '12-18m',
    price: '₹2,499',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=80&h=80&fit=crop',
    status: 'delivered',
    statusLabel: 'Delivered on Oct 22, 2025',
    statusSub: 'Your item has been delivered',
  },
  {
    id: 2,
    name: 'Premium Wool Cardigan',
    color: 'Oatmeal',
    size: '2-3Y',
    price: '₹3,850',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=80&h=80&fit=crop',
    status: 'delivered',
    statusLabel: 'Delivered on Nov 10, 2025',
    statusSub: 'Your item has been delivered',
  },
  {
    id: 3,
    name: 'Essential Linen Shirt',
    color: 'Sky Blue',
    size: '4Y',
    price: '₹1,250',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop',
    status: 'delivered',
    statusLabel: 'Delivered on Sep 11, 2025',
    statusSub: 'Your item has been delivered',
  },
  {
    id: 4,
    name: 'Classic Velvet Party Dress',
    color: 'Burgundy',
    size: '6Y',
    price: '₹5,400',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=80&h=80&fit=crop',
    status: 'delivered',
    statusLabel: 'Delivered on Dec 01, 2025',
    statusSub: 'Your item has been delivered',
  },
];

function StatusBadge({ status, label }) {
  return (
    <div className="mo-status-badge">
      <span className={`mo-status-dot ${status}`} />
      <span className={`mo-status-text ${status}`}>{label}</span>
    </div>
  );
}

export default function MyOrders() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const navigate = useNavigate();
  const [search, setSearch]           = useState('');
  const [query, setQuery]             = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Simple delay to ensure smooth transition
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="account-loading-wrapper">
        <div className="account-loading-spinner"></div>
        <p>Loading your Orders...</p>
      </div>
    );
  }

  const totalPages = 3;

  const filtered = orders.filter(o =>
    o.name.toLowerCase().includes(query.toLowerCase()) ||
    o.color.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mo-page">
      <div className="mo-content">

        {/* Breadcrumb — using div instead of nav to avoid inheriting global nav { position: sticky } */}
        <div className="mo-breadcrumb">
          <a href="/account" className="mo-breadcrumb-link">Account</a>
          <span className="mo-breadcrumb-sep">›</span>
          <span className="mo-breadcrumb-current">My Orders</span>
        </div>

        {/* Header */}
        <div className="mo-header">
          <h1>My Orders History</h1>
          <p>View and track your recent boutique purchases.</p>
        </div>

        {/* Search */}
        <div className="mo-search-row">
          <div className="mo-search-input-wrapper">
            <img src="/images/myorders/search.png" alt="search" className="mo-search-icon-img" />
            <input
              type="text"
              className="mo-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setQuery(search); }}
              placeholder="Search your orders here"
            />
          </div>
          <button className="mo-search-btn" onClick={() => setQuery(search)}>
            Search Orders
          </button>
        </div>

        {/* Orders List */}
        <div className="mo-list">
          {filtered.map(order => (
            <div key={order.id} className="mo-card">
              <div className="mo-card-top">

                <img src={order.image} alt={order.name} className="mo-card-img" />

                <div className="mo-card-info">
                  <div className="mo-card-name">{order.name}</div>
                  <div className="mo-card-meta">Color: {order.color} | Size: {order.size}</div>
                  <div className="mo-card-price">{order.price}</div>
                </div>

                <div className="mo-card-status">
                  <StatusBadge status={order.status} label={order.statusLabel} />
                  <div className="mo-status-sub">{order.statusSub}</div>
                  <button
                    className="mo-review-btn"
                    onClick={() => navigate('/account/write-review', { state: { order } })}
                  >☆ Rate &amp; Review Product</button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mo-pagination">
          <button className="mo-page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>‹</button>
          {[1, 2, 3].map(p => (
            <button
              key={p}
              className={`mo-page-btn ${currentPage === p ? 'active' : ''}`}
              onClick={() => setCurrentPage(p)}
            >{p}</button>
          ))}
          <button className="mo-page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>›</button>
        </div>

      </div>
    </div>
  );
}
