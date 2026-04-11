import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import { useState } from 'react';
import '../../styles/support/SupportHub.css';

export default function OrderHelp() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || null;

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

          {/* Header */}
          <div className="sh-hero sh-hero--compact">
            <div className="sh-oh-breadcrumb">
              <span className="sh-bc-link" onClick={() => navigate('/support')}>Support Hub</span>
              <span className="sh-bc-sep">›</span>
              <span className="sh-bc-current">Order Help</span>
            </div>
            <div className="sh-mobile-header">
              <button className="mobile-back-btn" onClick={() => navigate('/support')}>
                <span className="back-chevron">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </span>
              </button>
              <h1 className="sh-hero-title">Ways to connect for Order #{order?.displayId || order?.id}</h1>
            </div>
            <p className="sh-hero-sub">We're here to sort things out quickly for you.</p>
          </div>

          <div className="sh-body sh-body--stretch">

            {/* Order info strip */}
            {order && (
              <div className="sh-oh-order-strip">
                <img src={order.items?.[0]?.image || order.items?.[0]?.img || order.items?.[0]?.photo || '/logo.png'} alt="Product" className="sh-order-img" />
                <div className="sh-order-info">
                  <div className="sh-order-label">ORDER #{order.displayId || order.id}</div>
                  <div className="sh-order-id">{order.items?.[0]?.name || 'Recent Order'}</div>
                  <div className="sh-order-status">
                    Status: <span className="sh-status-delivered">Delivered</span>
                  </div>
                </div>
              </div>
            )}

            {/* Channels */}
            <div className="sh-connect-grid" style={{ marginTop: '30px' }}>
              <div 
                className="sh-connect-card" 
                onClick={() => navigate('/support/chat', { 
                  state: { 
                    orderId: order?.displayId || order?.id,
                    initialMessage: `Hi, I need help with a recent order. Order ID: #${order?.displayId || order?.id}`
                  } 
                })}
              >
                <div className="sh-connect-icon">💬</div>
                <div className="sh-connect-info">
                  <div className="sh-connect-label">Chat with us</div>
                  <div className="sh-connect-sub">Typical response time · 2 min</div>
                </div>
              </div>
              
              <div 
                className="sh-connect-card" 
                onClick={() => window.location.href = `mailto:sumathitrends.in@gmail.com?subject=Help with Order #${order?.displayId || order?.id}`}
              >
                <div className="sh-connect-icon">✉️</div>
                <div className="sh-connect-info">
                  <div className="sh-connect-label">Email us</div>
                  <div className="sh-connect-sub">sumathitrends.in@gmail.com</div>
                </div>
              </div>
            </div>

            {/* Support Issue Form */}
            <section className="sh-section" style={{marginTop:'40px'}}>
              <h2 className="sh-section-title">Report a Problem</h2>
              <div className="sh-issue-form">
                <p className="sh-form-hint">Describe the issue and upload photos/videos of the product for quick resolution.</p>
                <textarea 
                  className="sh-issue-desc" 
                  placeholder="Tell us what's wrong with this order..."
                  rows={4}
                  id="issue-description"
                />
                <div className="sh-file-upload">
                  <label htmlFor="support-files" className="sh-file-label">
                    <span>📷 Upload Photos/Videos</span>
                    <input 
                      type="file" 
                      id="support-files" 
                      multiple 
                      accept="image/*,video/*" 
                      style={{display:'none'}}
                      onChange={(e) => {
                        const count = e.target.files.length;
                        document.getElementById('file-count').innerText = count > 0 ? `${count} file(s) selected` : '';
                      }}
                    />
                  </label>
                  <span id="file-count" style={{fontSize:'12px', color:'#666', marginLeft:'10px'}}></span>
                </div>
                <button 
                  className="sh-search-btn" 
                  style={{width:'100%', marginTop:'15px'}}
                  onClick={async (e) => {
                    const btn = e.currentTarget;
                    const desc = document.getElementById('issue-description').value;
                    const files = document.getElementById('support-files').files;

                    if (!desc) return alert('Please describe the issue.');
                    
                    btn.disabled = true;
                    btn.innerText = 'Submitting...';

                    const formData = new FormData();
                    formData.append('userId', order.userId || localStorage.getItem('sumathi_uid'));
                    formData.append('orderId', order.displayId || order.id);
                    formData.append('description', desc);
                    for (let i = 0; i < files.length; i++) {
                      formData.append('attachments', files[i]);
                    }

                    try {
                      const res = await fetch('/api/support/submit', {
                        method: 'POST',
                        body: formData
                      });
                      const data = await res.json();
                      if (data.success) {
                        alert('Issue reported successfully. Our team will review it.');
                        navigate('/support');
                      } else {
                        alert(data.message || 'Failed to submit issue.');
                      }
                    } catch (err) {
                      alert('Error submitting report.');
                    } finally {
                      btn.disabled = false;
                      btn.innerText = 'Submit Report';
                    }
                  }}
                >
                  Submit Report
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
