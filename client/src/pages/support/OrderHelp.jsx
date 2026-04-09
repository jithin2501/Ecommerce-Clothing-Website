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
              <h1 className="sh-hero-title">How can we help?</h1>
            </div>
            <p className="sh-hero-sub">We're here to sort things out quickly for you.</p>
          </div>

          <div className="sh-body sh-body--stretch">

            {/* Order info strip */}
            {order && (
              <div className="sh-oh-order-strip">
                <img src={order.image} alt={order.name} className="sh-order-img" />
                <div className="sh-order-info">
                  <div className="sh-order-label">ORDER #{order.id}</div>
                  <div className="sh-order-id">{order.name}</div>
                  <div className="sh-order-status">
                    Status: <span className="sh-status-delivered">{order.status}</span> on {order.date}
                  </div>
                </div>
              </div>
            )}

            {/* Still need help */}
            <section className="sh-still-section sh-still-section--stretch">
              <h2 className="sh-still-title">Still need help?</h2>
              <p className="sh-still-sub">
                Our dedicated team is ready to assist you with anything you need. Reach out through our priority channels.
              </p>
              <div className="sh-channels sh-channels--two">
                <div className="sh-channel-card" onClick={() => navigate('/support/chat', { state: { order } })} style={{cursor:'pointer'}}>
                  <div className="sh-channel-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="sh-channel-title">Chat with us</div>
                    <div className="sh-channel-sub">Typical response time · 2 min</div>
                  </div>
                </div>
                <div className="sh-channel-card" onClick={() => window.location.href = 'mailto:sumathitrends.in@gmail.com'}>
                  <div className="sh-channel-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="sh-channel-title">Email us</div>
                    <div className="sh-channel-sub">sumathitrends.in@gmail.com</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Issue Form */}
            <section className="sh-section" style={{marginTop:'30px'}}>
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
                    formData.append('userId', order.userId);
                    formData.append('orderId', order.id);
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
