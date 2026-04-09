import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../../styles/myorders/OrderDetail.css';
import '../../styles/myorders/OrderInvoice.css';

function OrderInvoice({ order }) {
  if (!order) return null;

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Calculation logic (5% Inclusive GST)
  const totalAmount = order.amount || 0;
  const taxableValue = (totalAmount / 1.05);
  const totalGst = totalAmount - taxableValue;
  const halfGst = totalGst / 2;

  return (
    <div className="invoice-container" id="printable-invoice">
      <div className="inv-header">
        <h1 className="inv-shop-name">Sumathi Trends</h1>
        <p className="inv-address">
          No.52, Saxena complex, Kodigehalli Main Rd,<br/>
          Defence Layout, Sahakar Nagar, Bengaluru, Karnataka 560092
        </p>
        <p className="inv-address">Phone: 87928 88508</p>
        <p className="inv-address"><strong>GSTIN: APPLIED</strong></p>
        <div className="inv-tax-title">Tax Invoice</div>
      </div>

      <div className="inv-meta-grid">
        <div className="inv-meta-left">
          <p><strong>Bill No:</strong> {order.displayId || order.id || order._id.slice(-6).toUpperCase()}</p>
          <p><strong>Customer:</strong> {order.shippingAddress?.name?.toUpperCase() || 'VALUED CUSTOMER'}</p>
          <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
        </div>
        <div className="inv-meta-right">
          <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Time:</strong> {formatTime(order.createdAt)}</p>
        </div>
      </div>

      <table className="inv-table">
        <thead>
          <tr>
            <th className="inv-col-sn">Sn</th>
            <th>Item Name</th>
            <th className="inv-col-qty">Qty</th>
            <th className="inv-col-rate">Rate</th>
            <th className="inv-col-amt">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((it, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td><strong>{it.name.toUpperCase()}</strong> ({it.size})</td>
              <td>{it.qty}.00</td>
              <td>{parseFloat(it.price).toFixed(2)}</td>
              <td>{(parseFloat(it.price) * it.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="inv-summary">
        <div className="inv-summary-row">
          <span>Total Qty:</span>
          <span>{order.items.reduce((acc, it) => acc + (it.qty || 1), 0)}.00</span>
        </div>
        <div className="inv-summary-row">
          <span>Discount:</span>
          <span>0.00</span>
        </div>
        <div className="inv-summary-row inv-total-line">
          <span>Net Bill Amount:</span>
          <span>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="inv-payment-box">
        <div className="inv-payment-title">Payment Details</div>
        <div className="inv-summary-row">
          <span>Razorpay ID:</span>
          <span>{order.razorpayPaymentId || 'PREPAID ONLINE'}</span>
        </div>
      </div>

      <div className="inv-gst-summary">
        <table className="gst-table">
          <thead>
            <tr>
              <th rowSpan={2}>Taxable Value</th>
              <th colSpan={2}>CGST</th>
              <th colSpan={2}>SGST</th>
              <th rowSpan={2}>Total GST</th>
            </tr>
            <tr>
              <th>%</th>
              <th>Amt</th>
              <th>%</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{taxableValue.toFixed(2)}</td>
              <td>2.5</td>
              <td>{halfGst.toFixed(2)}</td>
              <td>2.5</td>
              <td>{halfGst.toFixed(2)}</td>
              <td>{totalGst.toFixed(2)}</td>
            </tr>
            <tr style={{fontWeight:'bold'}}>
              <td>{taxableValue.toFixed(2)}</td>
              <td></td>
              <td>{halfGst.toFixed(2)}</td>
              <td></td>
              <td>{halfGst.toFixed(2)}</td>
              <td>{totalGst.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="inv-footer-note">
        <p>Thank you for shopping with Sumathi Trends!</p>
        <p>This is a computer generated invoice.</p>
      </div>
    </div>
  );
}

function SimplifiedTracker({ trackingData, orderDate, onSeeAll }) {
  const activities = trackingData?.activities || [];
  const status = (trackingData?.trackingStatus || '').toUpperCase();

  const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Determine current/latest step
  let latestStep = { label: 'Processing', date: orderDate };
  if (activities.length > 0) {
    const last = activities[0]; // Activities are usually sorted newest first from my sync
    latestStep = { label: last.status, date: last.date };
  }

  return (
    <div className="simple-tracker-wrap">
      <div className="simple-tracker">
        {/* Step 1: Always Confirmed */}
        <div className="s-step completed">
          <div className="s-dot-wrap"><div className="s-dot" /><div className="s-line" /></div>
          <div className="s-text">Order Confirmed, {formatDateShort(orderDate)}</div>
        </div>
        
        {/* Step 2: Latest Update */}
        <div className={`s-step ${latestStep.label !== 'Processing' ? 'completed' : ''}`}>
          <div className="s-dot-wrap"><div className="s-dot" /></div>
          <div className="s-text">{latestStep.label}, {formatDateShort(latestStep.date)}</div>
        </div>
      </div>
      
      <button className="see-all-btn" onClick={onSeeAll}>
        See All Updates ›
      </button>
    </div>
  );
}

function TrackingModal({ isOpen, onClose, trackingData, orderDate }) {
  if (!isOpen) return null;

  const activities = trackingData?.activities || [];
  const courier = trackingData?.courier || 'Logistic Partner';
  const awb = trackingData?.awb || '';

  const getDay = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' });
  const getTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

  return (
    <div className="od-modal-overlay" onClick={onClose}>
      <div className="od-modal-content" onClick={e => e.stopPropagation()}>
        <div className="od-modal-header">
          <h3>Tracking Updates</h3>
          <button className="od-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="od-modal-body">
          <div className="full-tracker">
            {/* Start with Order Placed if no activities yet */}
            {activities.length === 0 && (
              <div className="full-step active">
                 <div className="fs-dot-line"><div className="fs-dot"/><div className="fs-line"/></div>
                 <div className="fs-info">
                   <div className="fs-label">Order Confirmed <span className="fs-date">{getDay(orderDate)}</span></div>
                   <p className="fs-msg">Your order has been placed and is being processed.</p>
                   <p className="fs-time">{getDay(orderDate)} - {getTime(orderDate)}</p>
                 </div>
              </div>
            )}

            {/* Live Activities from Shiprocket */}
            {activities.map((a, i) => (
              <div key={i} className="full-step active">
                <div className="fs-dot-line">
                  <div className="fs-dot" />
                  {i < activities.length - 1 && <div className="fs-line" />}
                </div>
                <div className="fs-info">
                  <div className="fs-label">{a.status} <span className="fs-date">{getDay(a.date)}</span></div>
                  {i === 0 && awb && <p className="fs-courier">{courier} - {awb}</p>}
                  <p className="fs-msg">{a.activity}</p>
                  <p className="fs-time">{getDay(a.date)} - {getTime(a.date)}</p>
                  {a.location && <p className="fs-loc">{a.location}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDownloadInvoice = () => {
    // We use the hidden OrderInvoice component which has visibility:visible in @media print
    window.print();
  };

  return (
    <div className="od-page">
      <OrderInvoice order={order} />

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
                {trackingLoading ? (
                  <div className="od-tracking-loading">Updating live tracking...</div>
                ) : (
                  <SimplifiedTracker 
                    trackingData={trackingData} 
                    orderDate={order.createdAt} 
                    onSeeAll={() => setIsModalOpen(true)}
                  />
                )}
              </div>

              <TrackingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                trackingData={trackingData}
                orderDate={order.createdAt}
              />

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

              <button className="od-download-btn" onClick={handleDownloadInvoice}>
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