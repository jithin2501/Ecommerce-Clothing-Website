import { useEffect, useState } from 'react';
import { Search, Bell, Filter, Download, ArrowUpRight, ArrowDownRight, Calendar, MoreHorizontal } from 'lucide-react';
import '../assets/paymentmanagement.css';

const API = '/api/payment/orders';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
});

export default function PaymentManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(API, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) setOrders(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchOrders();
  }, [selectedYear]);

  const totalRev = orders.filter(o => o.status === 'success').reduce((acc, curr) => acc + curr.amount, 0);
  const successCount = orders.filter(o => o.status === 'success').length;

  return (
    <div className="dash-container">
      <h1 className="dash-main-title">Payment Dashboard</h1>
      
      <div className="dash-section-header">
        <div className="dash-breadcrumb">
          Overview <span className="dash-sub">Show: {selectedYear}</span>
        </div>
        <div className="dash-tools">
          <button className="dash-tool-btn"><Download size={14} /> Export</button>
          <div className="dash-year-select">
            <Calendar size={14} />
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Statistics Summary Bar ── */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-sc-top"><span>Total Revenue</span></div>
          <div className="dash-sc-val">₹{totalRev.toLocaleString('en-IN')}</div>
          <div className="dash-sc-foot">
            <span className="sc-trend green">+4.5% <ArrowUpRight size={12} /></span>
            <span className="sc-vs">Vs last month</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-sc-top"><span>Total Customer</span></div>
          <div className="dash-sc-val">{successCount}</div>
          <div className="dash-sc-foot">
            <span className="sc-trend green">+12.2% <ArrowUpRight size={12} /></span>
            <span className="sc-vs">Vs last month</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-sc-top"><span>Total Transaction</span></div>
          <div className="dash-sc-val">{orders.length}</div>
          <div className="dash-sc-foot">
            <span className="sc-trend red">-1.5% <ArrowDownRight size={12} /></span>
            <span className="sc-vs">Vs last month</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-sc-top"><span>Total Products</span></div>
          <div className="dash-sc-val">987</div>
          <div className="dash-sc-foot">
            <span className="sc-trend green">+2.5% <ArrowUpRight size={12} /></span>
            <span className="sc-vs">Vs last month</span>
          </div>
        </div>
      </div>

      {/* ── Main Analytical Chart Card (Matches New Mockup) ── */}
      <div className="dash-mid-row">
        <div className="dash-analytic-card">
          <div className="dash-ac-header">
             <div className="ac-title-wrap">
               <h3>Sales Analytic</h3>
             </div>
             <div className="ac-sort">
               <span>Sort by</span>
               <div className="ac-sort-select">
                 <Calendar size={14} /> Aug 2024
               </div>
             </div>
          </div>

          <div className="dash-ac-chart-area">
             <div className="ac-chart-canvas">
               <svg viewBox="0 0 800 250" className="curved-analytic-svg">
                 <defs>
                   <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#2DD4BF" stopOpacity="0.3"/>
                     <stop offset="95%" stopColor="#2DD4BF" stopOpacity="0"/>
                   </linearGradient>
                 </defs>
                 
                 {/* Left labels (Value Axis) */}
                 <g fill="#94A3B8" fontSize="12" fontWeight="600">
                    <text x="5" y="20">100k</text>
                    <text x="5" y="65">50k</text>
                    <text x="5" y="110">10k</text>
                    <text x="5" y="155">1k</text>
                    <text x="5" y="200">0</text>
                 </g>

                 {/* Custom Grid lines */}
                 <line x1="45" y1="20" x2="800" y2="20" stroke="#f1f5f9" />
                 <line x1="45" y1="65" x2="800" y2="65" stroke="#f1f5f9" />
                 <line x1="45" y1="110" x2="800" y2="110" stroke="#f1f5f9" />
                 <line x1="45" y1="155" x2="800" y2="155" stroke="#f1f5f9" />
                 <line x1="45" y1="200" x2="800" y2="200" stroke="#1e293b" strokeWidth="1" />
                 
                 {/* Curved Path (Value range 20 to 200) */}
                 <path 
                   d="M45,180 C145,180 195,80 245,80 C295,80 345,160 445,160 C545,160 595,60 695,60 C795,60 815,100 845,100" 
                   fill="none" 
                   stroke="#2DD4BF" 
                   strokeWidth="3" 
                 />
                 <path 
                   d="M45,180 C145,180 195,80 245,80 C295,80 345,160 445,160 C545,160 595,60 695,60 C795,60 815,100 845,100 L845,200 L45,200 Z" 
                   fill="url(#chartGradient)" 
                 />

                 {/* Bottom labels (Date Axis) */}
                 <g fill="#94A3B8" fontSize="11" fontWeight="600">
                    <text x="45" y="235">22 July</text>
                    <text x="145" y="235">23 July</text>
                    <text x="245" y="235">24 July</text>
                    <text x="345" y="235">25 July</text>
                    <text x="445" y="235">26 July</text>
                    <text x="545" y="235">27 July</text>
                    <text x="645" y="235">28 July</text>
                    <text x="745" y="235">29 July</text>
                 </g>
               </svg>
             </div>
          </div>
        </div>

        <div className="dash-gauge-card premium-style">
          <div className="dash-sc-top">
            <span>Customers Volume</span>
          </div>
          
          <div className="dash-radial-wrap">
             <div className="dash-radial-svg">
                <svg viewBox="0 0 200 200">
                   <defs>
                      <linearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" stopColor="#2D3E50" />
                         <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <filter id="glow">
                         <feGaussianBlur stdDeviation="3" result="blur" />
                         <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                   </defs>
                   {/* Background Track */}
                   <circle cx="100" cy="100" r="70" fill="none" stroke="#F1F5F9" strokeWidth="18" strokeLinecap="round" />
                   {/* Progress Ring */}
                   <circle 
                      cx="100" cy="100" r="70" 
                      fill="none" stroke="url(#radialGradient)" 
                      strokeWidth="18" 
                      strokeLinecap="round" 
                      strokeDasharray="440" 
                      strokeDashoffset="132" /* 70% progress */
                      transform="rotate(-90 100 100)"
                      filter="url(#glow)"
                   />
                </svg>
                <div className="dash-radial-content">
                   <div className="radial-num">220</div>
                   <div className="radial-label">New Customers</div>
                </div>
             </div>
          </div>

          <div className="dash-radial-footer">
             <div className="radial-footer-pill">
                <div className="pill-dot blue" />
                <span>Weekly Growth</span>
                <span className="pill-val green">+15.4%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="dash-bottom-row-full">
        <div className="dash-table-card">
          <div className="dash-cc-header">
            <h3>Recent Transaction</h3>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table fixed-layout">
              <thead>
                <tr>
                  <th style={{width: '20%'}}>Client Name</th>
                  <th style={{width: '20%', textAlign: 'center'}}>ID</th>
                  <th style={{width: '20%', textAlign: 'center'}}>Transaction ID</th>
                  <th style={{width: '20%', textAlign: 'center'}}>Payment Method</th>
                  <th style={{width: '20%', textAlign: 'center'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* ── Example Transaction Entry (Hardcoded for Visual Guidance) ── */}
                <tr>
                   <td className="box-cell">Sumathi Trends</td>
                   <td className="box-cell center-text"><span className="mono-text">A8B2C4</span></td>
                   <td className="box-cell center-text mono-text">pay_P1rW3d7Lz9</td>
                   <td className="box-cell center-text">Netbanking</td>
                   <td className="box-cell center-text"><span className="status-badge success">success</span></td>
                </tr>

                {orders.map((o, i) => (
                  <tr key={o._id}>
                    <td className="box-cell">{o.user?.name || 'Guest User'}</td>
                    <td className="box-cell center-text"><span className="mono-text">{o.user?.id?.slice(-6) || 'N/A'}</span></td>
                    <td className="box-cell center-text mono-text">{o.paymentId || o.orderId || 'PENDING'}</td>
                    <td className="box-cell center-text">Netbanking</td>
                    <td className="box-cell center-text"><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
