import { Download, Search, RefreshCw, CheckCircle, Package, Truck, Home, Eye, X, User, MapPin, ShoppingBag } from 'lucide-react';
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
  return (
    <div className="om-drawer-overlay" onClick={onClose}>
      <aside className="om-drawer" onClick={e => e.stopPropagation()}>
        <button className="om-drawer-close" onClick={onClose}><X size={20} /></button>
        
        <div className="om-drawer-head">
          <div className="om-drawer-id">ORDER #{order.displayId}</div>
          <div className={`om-drawer-status ${order.trackingStatus?.toLowerCase()}`}>{order.trackingStatus}</div>
        </div>

        <div className="om-drawer-body">
          {/* Tracking Section */}
          <div className="om-drawer-section">
            <h4 className="om-sect-title"><Truck size={16} /> Live Tracking</h4>
            <TrackingTimeline currentStatus={order.trackingStatus} />
            {order.trackingLink && (
              <a href={order.trackingLink} target="_blank" rel="noopener noreferrer" className="om-track-link">
                Tracking Page ↗
              </a>
            )}
          </div>

          {/* Client Section */}
          <div className="om-drawer-section">
            <h4 className="om-sect-title"><User size={16} /> Customer Info</h4>
            <div className="om-info-card">
              <p><strong>Name:</strong> {order.userName || 'Guest'}</p>
              <p><strong>Email:</strong> {order.userEmail || 'N/A'}</p>
            </div>
          </div>

          {/* Address Section */}
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

          {/* Products Section */}
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
        </div>
      </aside>
    </div>
  );
}

function TrackingTimeline({ currentStatus }) {
  const status = (currentStatus || '').toUpperCase();
  const steps = [
    { key: 'ORDERED', label: 'Ordered', icon: CheckCircle },
    { key: 'SHIPPED', label: 'In Transit', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home }
  ];

  const getStepStatus = (index) => {
    let currentIdx = 0;
    if (['SHIPPED', 'PICKED UP', 'IN TRANSIT'].includes(status)) currentIdx = 1;
    if (['OUT FOR DELIVERY', 'OFD'].includes(status)) currentIdx = 2;
    if (status === 'DELIVERED') currentIdx = 2; // Combine OFD/Delivered for drawer logic

    if (index < currentIdx) return 'completed';
    if (index === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="om-timeline">
      {steps.map((s, i) => {
        const stepStatus = getStepStatus(i);
        return (
          <div key={s.key} className={`om-step ${stepStatus}`}>
            <div className="om-step-dot" />
            <div className="om-step-label">{s.label}</div>
            {i < steps.length - 1 && <div className="om-step-line" />}
          </div>
        );
      })}
    </div>
  );
}
