import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../../styles/myorders/OrderDetail.css';

function StatusTimeline({ status, date }) {
  const steps = [
    { label: 'Order Confirmed', id: 'pending', date: date },
    { label: 'Shipped', id: 'shipped', date: date },
    { label: 'Out for Delivery', id: 'out_for_delivery', date: date },
    { label: 'Delivered', id: 'success', date: date }
  ];

  const currentIdx = status === 'success' ? 3 : 0; // Simplified for demo

  return (
    <div className="od-timeline">
      {steps.map((step, i) => (
        <div key={i} className={`od-timeline-step ${i <= currentIdx ? 'active' : ''}`}>
          <div className="od-step-circle">
             {i <= currentIdx && <span className="od-check">✓</span>}
          </div>
          <div className="od-step-content">
            <div className="od-step-label">{step.label}, {new Date(step.date).toLocaleDateString()}</div>
          </div>
          {i < steps.length - 1 && <div className={`od-step-line ${i < currentIdx ? 'active' : ''}`} />}
        </div>
      ))}
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
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

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

              {/* Status Timeline */}
              <div className="od-timeline-wrap">
                 <StatusTimeline status={order.status} date={order.createdAt} />
                 <button className="od-updates-link">See All Updates ›</button>
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
                 <div className="od-rate-flex">
                    <div className="od-check-icon">✓</div>
                    <span>Rate the product</span>
                 </div>
                 <StarRating value={rating} onChange={setRating} />
                 {rating > 0 && <p className="od-rate-thanks">Thank you for your rating!</p>}
               </div>
               <button className="od-helpful-link">
                 Did you find this page helpful? <span>›</span>
               </button>
            </div>

            {/* 3. Items In This Order */}
            <div className="od-card others-card">
              <h3>Items In This Order</h3>
              {order.items.map((oi, idx) => (
                <div 
                  key={idx} 
                  className={`od-list-item ${oi.productId === item.productId && oi.size === item.size ? 'active' : ''}`}
                  onClick={() => navigate(`/account/orders/${order.orderId}`, { state: { order, item: oi }, replace: true })}
                >
                  <img src={oi.img || oi.photo} alt={oi.name} className="od-list-img" />
                  <div className="od-list-info">
                     <h4>{oi.name}</h4>
                     <p className="od-list-meta">{oi.color}, {oi.size}</p>
                     <p className="od-list-seller">Seller: SUMATHI TRENDS</p>
                     <p className="od-list-price">₹{parseFloat(String(oi.price).replace(/[₹$,]/g, '')).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

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
                     <strong>Home:</strong> {[order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.pincode].filter(Boolean).join(', ')}
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
