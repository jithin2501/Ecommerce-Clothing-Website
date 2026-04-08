import { useEffect, useState } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import '../assets/OrderManagement.css';

const API = '/api/payment/orders';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(API, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) {
          // We only care about successful payments for fulfillment
          setOrders(data.data.filter(o => o.status === 'success'));
        }
      } catch (err) {
        console.error('Error fetching orders for management:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="dash-container"><div className="no-orders-msg">Loading Orders...</div></div>;

  return (
    <div className="dash-container">
      <h1 className="dash-main-title">Order Management</h1>
      
      <div className="dash-wrapper-box">
        <div className="align-between" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Courier Fulfillment</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>Manage shipments for paid orders</p>
          </div>
          <div className="dash-tools">
            <button className="dash-tool-btn"><Filter size={14} /> Filter</button>
            <button className="dash-tool-btn"><Download size={14} /> Export List</button>
          </div>
        </div>

        <div className="dash-order-grid">
          {orders.map((o) => (
            <div key={o._id} className="dash-order-full-card">
              <div className="order-fc-header">
                <div className="order-fc-id">
                   <span className="fc-id-label">ORDER ID:</span>
                   <span className="fc-id-val"># {o.orderId?.slice(-10)}</span>
                </div>
                <div className="order-fc-status success">Paid</div>
              </div>

              <div className="order-fc-body">
                {/* Client Section */}
                <div className="fc-body-sect">
                  <h4>Client Information</h4>
                  <div className="fc-info-row"><strong>Name:</strong> {o.userName || o.user?.name || 'Guest'}</div>
                  <div className="fc-info-row"><strong>Email:</strong> {o.userEmail || o.shippingAddress?.email || 'N/A'}</div>
                  <div className="fc-info-row"><strong>Pay ID:</strong> <span className="mono-text">{o.paymentId || 'N/A'}</span></div>
                </div>

                {/* Shipping Section */}
                <div className="fc-body-sect">
                  <h4>Shipping Address</h4>
                  <div className="fc-address-wrap">
                    {o.shippingAddress ? (
                      <>
                        <p><strong>{o.shippingAddress.name || o.shippingAddress.fullName}</strong></p>
                        <p>{o.shippingAddress.street || o.shippingAddress.address}</p>
                        <p>{o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode || o.shippingAddress.zip}</p>
                        <p style={{ marginTop: '8px', color: '#0F172A' }}><strong>PH:</strong> {o.shippingAddress.phone || o.shippingAddress.mobile || 'N/A'}</p>
                      </>
                    ) : (
                      <p className="no-addr">No address provided</p>
                    )}
                  </div>
                </div>

                {/* Products Section */}
                <div className="fc-body-sect full-w">
                   <h4>Ordered Products ({o.items?.length || 0})</h4>
                   <div className="fc-prod-list">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="fc-prod-item">
                           <div className="fc-p-name">{item.name}</div>
                           <div className="fc-p-meta">Qty: {item.qty} | Price: ₹{item.price}</div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Shiprocket Delivery Section */}
                <div className="fc-body-sect full-w">
                   <h4>Shipping & Tracking</h4>
                   <div className="fc-tracking-wrap" style={{ 
                     display: 'flex', gap: '15px', background: '#f8fafc', 
                     padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', 
                     flexWrap: 'wrap', marginTop: '5px' 
                   }}>
                     {o.shiprocketOrderId ? (
                       <>
                         <div><strong>SR Order ID:</strong> {o.shiprocketOrderId}</div>
                         <div><strong>Shipment ID:</strong> {o.shiprocketShipmentId || 'Pending'}</div>
                         <div>
                           <strong>Status:</strong> <span style={{ color: o.trackingStatus === 'Delivered' ? '#16a34a' : '#d97706', fontWeight: 600 }}>{o.trackingStatus || 'Unshipped'}</span>
                         </div>
                         {o.trackingLink && (
                           <div>
                             <a href={o.trackingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                               Track Order ↗
                             </a>
                           </div>
                         )}
                       </>
                     ) : (
                       <div style={{ color: '#64748b' }}>Shiprocket sync pending or not created.</div>
                     )}
                   </div>
                </div>
              </div>
              
              <div className="order-fc-footer">
                <button className="fc-btn primary" onClick={() => window.print()}>Print Shipping Label</button>
                <button className="fc-btn secondary">Update Status</button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="no-orders-msg">No successful orders found for shipment processing.</div>
          )}
        </div>
      </div>
    </div>
  );
}
