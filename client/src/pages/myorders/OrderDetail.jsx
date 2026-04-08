import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../../styles/myorders/OrderDetail.css';

function ProfessionalTracker({ loading, trackingData, orderDate }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' };
    const parts = date.toLocaleDateString('en-IN', options).split(' ');
    // Format: Thu, 9 Oct '25
    return `${parts[0]} ${parts[1]}${getOrdinal(parts[1])} ${parts[2]} '${parts[3]}`;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  };

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  if (loading) return <div className="od-tracking-loading">Updating live tracking...</div>;

  const activities = trackingData?.activities || [];
  const courier = trackingData?.courier || 'Logistic Partner';
  const awb = trackingData?.awb || '';

  // Logical steps based on activities
  const steps = [
    { label: 'Order Confirmed', key: 'NEW' },
    { label: 'Shipped', key: 'SHIPPED' },
    { label: 'Out For Delivery', key: 'OFD' },
    { label: 'Delivered', key: 'DELIVERED' }
  ];

  return (
    <div className="prof-tracker">
      {steps.map((step, idx) => {
        const matchingActivity = activities.find(a => {
          const s = a.status.toUpperCase();
          if (step.key === 'NEW' && (s.includes('NEW') || s.includes('CONFIRMED'))) return true;
          if (step.key === 'SHIPPED' && (s.includes('SHIPPED') || s.includes('PICKED UP') || s.includes('TRANSIT'))) return true;
          if (step.key === 'OFD' && (s.includes('OFD') || s.includes('OUT FOR DELIVERY'))) return true;
          if (step.key === 'DELIVERED' && s.includes('DELIVERED')) return true;
          return false;
        });

        const isActive = !!matchingActivity;

        return (
          <div key={idx} className={`prof-step ${isActive ? 'active' : ''}`}>
            <div className="prof-dot-line">
              <div className="prof-dot" />
              {idx < steps.length - 1 && <div className="prof-line" />}
            </div>
            <div className="prof-info">
              <div className="prof-label-row">
                <span className="prof-label">{step.label}</span>
                {isActive && <span className="prof-main-date">{formatDate(matchingActivity.date)}</span>}
              </div>
              
              {step.key === 'NEW' && !isActive && (
                <div className="prof-sub">
                  <p>Your Order has been placed.</p>
                  <p className="prof-time">{formatDate(orderDate)} - {formatTime(orderDate)}</p>
                </div>
              )}

              {isActive && (
                <div className="prof-sub">
                  {step.key === 'SHIPPED' && awb && (
                    <p className="prof-courier">{courier} - {awb}</p>
                  )}
                  <p>{matchingActivity.activity || `Your item has been ${step.label.toLowerCase()}.`}</p>
                  <p className="prof-location">{matchingActivity.location}</p>
                  <p className="prof-time">{formatDate(matchingActivity.date)} - {formatTime(matchingActivity.date)}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="od-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          className={`od-star ${s <= (hover || value) ? 'active' : ''}`}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        >★</span>
      ))}
    </div>
  );
}

export default function OrderDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, item } = location.state || {};
  const [rating, setRating] = useState(0);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'instant' }); 
    
    // Auto-sync detailed tracking on load
    if (order?._id && order.shiprocketShipmentId) {
      const syncTracking = async () => {
        setTrackingLoading(true);
        try {
          const res = await fetch(`/api/payment/track/${order._id}`);
          const data = await res.json();
          if (data.success) {
            setTrackingData(data);
          }
        } catch (err) {
          console.error('Tracking fetch error:', err);
        } finally {
          setTrackingLoading(false);
        }
      };
      syncTracking();
    }
  }, []);

  if (!order || !item) {
    return (
      <div className="od-error">
        <p>Order details not found.</p>
        <button onClick={() => navigate('/account/orders')}>Back to Orders</button>
      </div>
    );
  }

  const otherItems = order.items.filter(i => i.productId !== item.productId || i.size !== item.size);

  // Price breakdown based on original paid amount
  const itemPrice = parseFloat(String(item.price).replace(/[₹$,]/g, '')) * item.qty;
  const listingPrice = itemPrice;
  const specialPrice = itemPrice;
  const totalFees = 40; // Mock shipping or tax
  const totalAmount = order.amount;

  return (
    <div className="od-page">
      <div className="od-container">

        {/* Header / Breadcrumb */}
        <div className="od-breadcrumb">
          <span onClick={() => navigate('/account/orders')}>My Orders</span>
          <span className="sep">›</span>
          <span className="current">Order Details</span>
        </div>

        <div className="od-grid">

          {/* LEFT COLUMN: Product & Tracking */}
          <div className="od-left">

            {/* 1. Primary Product */}
            <div className="od-card main-prod-card">
              <div className="od-prod-header">
                <div className="od-prod-main">
                  <h1>{item.name}</h1>
                  <p className="od-prod-meta">{item.color}, {item.size}</p>
                  <p className="od-prod-seller">Seller: SUMATHI TRENDS</p>
                  <div className="od-prod-price">₹{itemPrice.toLocaleString()}</div>
                </div>
                <img src={item.img || item.photo} alt={item.name} className="od-prod-img" />
              </div>

              {/* Professional Tracking Timeline */}
              <div className="od-timeline-wrap">
                <ProfessionalTracker 
                  loading={trackingLoading}
                  trackingData={trackingData}
                  orderDate={order.createdAt}
                />
              </div>

              <div className="od-chat-section">
                <button className="od-chat-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Chat with us
                </button>
              </div>
            </div>

            {/* 2. Rate Experience */}
            <div className="od-card rate-card">
              <h2>Rate your experience</h2>
              <div className="od-rate-box">
                <div className="od-rate-stars-row">
                  <StarRating value={rating} onChange={setRating} />
                  <button
                    className="od-write-review-btn"
                    onClick={() => navigate('/account/write-review', { state: { order, item, rating } })}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Write review
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Other Items In This Order — only shown if there are other items */}
            {otherItems.length > 0 && (
              <div className="od-card others-card">
                <h3>Other Items In This Order</h3>
                <div className="od-others-divider" />
                {otherItems.map((oi, idx) => (
                  <div
                    key={idx}
                    className="od-other-item"
                    onClick={() => { navigate(`/account/orders/${order.orderId}`, { state: { order, item: oi }, replace: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                  >
                    <div className="od-other-item-name">{oi.name}</div>
                    <img src={oi.img || oi.photo} alt={oi.name} className="od-other-item-img" />
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Delivery & Price */}
          <div className="od-right">

            {/* 1. Delivery Details */}
            <div className="od-card info-card">
              <h2 className="od-section-title">DELIVERY DETAILS</h2>
              <div className="od-boxed-content">
                <div className="od-info-row single-line">
                  <div className="od-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div className="od-info-text">
                    <strong>Home:</strong> {(() => {
                      const full = [order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.pincode].filter(Boolean).join(', ');
                      return full.length > 30 ? full.slice(0, 30) + '…' : full;
                    })()}
                  </div>
                </div>
                <div className="od-info-row-divider" />
                <div className="od-info-row single-line">
                  <div className="od-info-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="od-info-text">
                    <strong>{order.shippingAddress?.name?.toUpperCase()}</strong>, {order.shippingAddress?.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Price Details */}
            <div className="od-card info-card price-details">
              <h2 className="od-section-title">PRICE DETAILS</h2>
              <div className="od-boxed-content">
                <div className="od-price-row">
                  <span>Listing price</span>
                  <span>₹{listingPrice.toLocaleString()}</span>
                </div>
                <div className="od-price-row">
                  <span>Shipping</span>
                  <span className="od-free-shipping">FREE</span>
                </div>
                <div className="od-price-row">
                  <span>Estimated Tax</span>
                  <span>₹0.00</span>
                </div>

                <div className="od-price-total">
                  <span>Total Amount</span>
                  <span>₹{itemPrice.toLocaleString()}</span>
                </div>

                <div className="od-payment-row">
                  <span>Payment method</span>
                  <span className="od-pay-val">{order.paymentMethod || 'Card Payment'}</span>
                </div>
              </div>

              <button className="od-download-btn" onClick={() => window.print()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Invoice
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}