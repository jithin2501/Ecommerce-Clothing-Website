import { useState, useEffect, useRef } from 'react';
import { Download, Search, RefreshCw, CheckCircle, Package, Truck, Home, Eye, X, User, MapPin, ShoppingBag, Printer } from 'lucide-react';
import '../assets/OrderManagement.css';

const API = '/api/payment/orders';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.filter(o => o.status === 'success'));
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh the order list from our DB every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // BACKGROUND SYNC: Automatically ask Shiprocket for updates every 60s for orders in progress
  useEffect(() => {
    if (orders.length === 0) return;

    const activeOrders = orders.filter(o => o.shiprocketShipmentId && (o.trackingStatus || '').toUpperCase() !== 'DELIVERED');
    
    const syncInterval = setInterval(() => {
      activeOrders.forEach(o => handleSyncStatus(o._id));
    }, 60000); // Check Shiprocket every 60 seconds

    return () => clearInterval(syncInterval);
  }, [orders]);

  const handleSyncStatus = async (orderId) => {
    setSyncingId(orderId);
    try {
      const res = await fetch(`/api/payment/track/${orderId}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, trackingStatus: data.trackingStatus } : o));
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const status = (o.trackingStatus || '').toUpperCase();
    const isUnfinished = status !== 'DELIVERED';
    const isSameDay = o.createdAt?.split('T')[0] === selectedDate;
    const matchesSearch = o.displayId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Logic: Show if (match search) AND (either unfinished OR from selected date)
    return matchesSearch && (isUnfinished || isSameDay);
  });

  if (loading) return <div className="om-page"><div className="no-orders-msg">Loading Orders...</div></div>;

  return (
    <div className="om-page">
      {/* Aligned Header */}
      <header className="om-header">
        <h1 className="om-title">ORDER DASHBOARD</h1>
        <div className="om-header-tools">
          <div className="om-search-box">
            <Search size={16} />
            <input 
              placeholder="Search Display ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="om-date-filter">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button className="om-export-btn"><Download size={14} /> Export</button>
        </div>
      </header>

      <div className="om-content">
        <div className="om-table-wrap">
          <table className="om-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CLIENT</th>
                <th>AMOUNT</th>
                <th>TRACKING</th>
                <th>DATE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o._id} className="om-row" onClick={() => setSelectedOrder(o)}>
                  <td>
                    <div className="om-id-cell">
                       <span className={`om-status-dot ${o.trackingStatus === 'DELIVERED' ? 'done' : 'active'}`} />
                       <strong>#{o.displayId}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="om-client-cell">
                      <span>{o.userName || 'Guest'}</span>
                      <span className="om-client-sub">{o.userEmail || 'N/A'}</span>
                    </div>
                  </td>
                  <td><span className="om-amount">₹{o.amount.toLocaleString()}</span></td>
                  <td>
                    <div className="om-tracking-cell">
                      <span className={`om-tag ${(o.trackingStatus || '').toLowerCase()}`}>{o.trackingStatus || 'Pending'}</span>
                      {o.shiprocketShipmentId && (
                         <button 
                           className={`om-sync-btn ${syncingId === o._id ? 'spinning' : ''}`}
                           onClick={(e) => { e.stopPropagation(); handleSyncStatus(o._id); }}
                         >
                           <RefreshCw size={12} />
                         </button>
                      )}
                    </div>
                  </td>
                  <td className="om-date-cell">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                     <button className="om-view-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="no-orders-msg">No orders found matching your criteria.</div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDrawer 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════
   ORDER DETAIL DRAWER (LIKE CLIENT MGMT)
   ════════════════════════════════════ */
function OrderDrawer({ order, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${order.displayId}</title>
          <style>
             body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
             .print-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; max-width: 600px; margin: auto; }
             .p-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
             .p-id-grp { display: flex; flex-direction: column; }
             .p-id-lab { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; }
             .p-id-val { font-size: 18px; font-weight: 800; margin-top: 4px; }
             .p-paid { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; }
             .p-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; }
             .p-sect h4 { font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; margin-bottom: 10px; }
             .p-info { font-size: 13px; line-height: 1.5; color: #334155; }
             .p-prod-list { margin-top: 20px; }
             .p-prod-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dotted #e2e8f0; font-size: 13px; }
          </style>
        </head>
        <body onload="window.print();window.close()">
           <div class="print-card">
              <div class="p-header">
                <div class="p-id-grp">
                   <span class="p-id-lab">ORDER ID:</span>
                   <span class="p-id-val"># ${order.displayId}</span>
                </div>
                <span class="p-paid">PAID</span>
              </div>
              <div class="p-grid">
                 <div class="p-sect">
                    <h4>CLIENT INFORMATION</h4>
                    <div class="p-info">
                       <strong>Name:</strong> ${order.userName || 'Guest'}<br/>
                       <strong>Email:</strong> ${order.userEmail || 'N/A'}
                    </div>
                 </div>
                 <div class="p-sect">
                    <h4>SHIPPING ADDRESS</h4>
                    <div class="p-info">
                       <strong>${order.shippingAddress?.name || 'Customer'}</strong><br/>
                       ${order.shippingAddress?.street || order.shippingAddress?.address || ''}<br/>
                       ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}<br/>
                       <strong>PH: ${order.shippingAddress?.phone}</strong>
                    </div>
                 </div>
              </div>
              <div class="p-prod-list">
                 <div class="p-sect"><h4>ORDERED PRODUCTS (${order.items?.length})</h4></div>
                 ${order.items.map(it => `
                   <div class="p-prod-item">
                      <span><strong>${it.name}</strong></span>
                      <span>Qty: ${it.qty} | Price: ₹${it.price}</span>
                   </div>
                 `).join('')}
              </div>
           </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="om-drawer-overlay" onClick={onClose}>
      <aside className="om-drawer" onClick={e => e.stopPropagation()}>
        <button className="om-drawer-close" onClick={onClose}><X size={20} /></button>
        
        <div className="om-drawer-head">
          <div className="om-drawer-id">ORDER #{order.displayId}</div>
          <div className={`om-drawer-status ${order.trackingStatus?.toLowerCase()}`}>{order.trackingStatus}</div>
        </div>

        <div className="om-drawer-body" ref={printRef}>
          {/* 1. Products Section */}
          <div className="om-drawer-section">
            <h4 className="om-sect-title"><ShoppingBag size={16} /> Products ({order.items?.length})</h4>
            <div className="om-prod-list">
              {order.items?.map((it, idx) => (
                <div key={idx} className="om-prod-item">
                  <span className="om-p-name">{it.name}</span>
                  <span className="om-p-meta">x{it.qty} · ₹{it.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Address Section */}
          <div className="om-drawer-section">
            <h4 className="om-sect-title"><MapPin size={16} /> Shipping Address</h4>
            <div className="om-info-card address">
              {order.shippingAddress ? (
                <>
                  <p><strong>{order.shippingAddress.name}</strong></p>
                  <p>{order.shippingAddress.street || order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="om-ph-row">PH: {order.shippingAddress.phone}</p>
                </>
              ) : <p>No address info.</p>}
            </div>
          </div>

          {/* 3. Client Section */}
          <div className="om-drawer-section">
            <h4 className="om-sect-title"><User size={16} /> Customer Info</h4>
            <div className="om-info-card">
              <p><strong>Name:</strong> {order.userName || 'Guest'}</p>
              <p><strong>Email:</strong> {order.userEmail || 'N/A'}</p>
            </div>
          </div>

          {/* 4. Tracking Section (Last) */}
          <div className="om-drawer-section">
            <h4 className="om-sect-title"><Truck size={16} /> Live Tracking</h4>
            <DetailedTracking status={order.trackingStatus} trackingData={order.trackingPayload} />
            {order.trackingLink && order.trackingPayload?.activities?.length > 0 && (
              <a href={order.trackingLink} target="_blank" rel="noopener noreferrer" className="om-track-link">
                Tracking Page ↗
              </a>
            )}
          </div>
        </div>

        <div className="om-drawer-footer">
          <button className="om-print-btn" onClick={handlePrint}>
            <Printer size={16} /> Print
          </button>
        </div>
      </aside>
    </div>
  );
}

function DetailedTracking({ status, trackingData }) {
  const activities = trackingData?.activities || [];
  
  const getDay = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  const getTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="om-detailed-tracking">
      {activities.length === 0 ? (
        <div className="om-tracking-pending">No tracking scans yet</div>
      ) : (
        activities.map((a, i) => (
          <div key={i} className="om-t-step active">
            <div className="om-t-dot-wrap">
              <div className="om-t-dot" />
              {i < activities.length - 1 && <div className="om-t-line" />}
            </div>
            <div className="om-t-info">
              <div className="om-t-label">{a.status} <span className="om-t-date">{getDay(a.date)}</span></div>
              <p className="om-t-msg">{a.activity}</p>
              <p className="om-t-time">{getTime(a.date)} · {a.location || 'Hub'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
