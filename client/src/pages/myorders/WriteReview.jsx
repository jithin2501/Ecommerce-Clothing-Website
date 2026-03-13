import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/myorders/WriteReview.css';

const FAQ = [
  {
    q: 'Have you used this product?',
    a: 'Share specific details about the fit, fabric quality, and how it holds up after washing. Honest feedback helps other parents make the best choice for their little ones.',
    defaultOpen: true,
  },
  { q: 'Why review a product?', a: 'Your review helps other parents in our community make informed decisions and helps us improve our products.' },
  { q: 'How to review a product?', a: 'Rate the product from 1–5 stars, write a short description of your experience, add your name, and optionally upload a photo or video.' },
];

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="wr-faq-list">
      {items.map((item, i) => (
        <div key={i} className="wr-faq-item">
          <button className="wr-faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
            <span className={open === i ? 'wr-faq-q-text active' : 'wr-faq-q-text'}>{item.q}</span>
            <span className="wr-faq-chevron">{open === i ? '∧' : '∨'}</span>
          </button>
          {open === i && <p className="wr-faq-a">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="wr-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          className={`wr-star ${s <= (hover || value) ? 'wr-star--filled' : ''}`}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        >★</span>
      ))}
    </div>
  );
}

export default function WriteReview() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  const navigate   = useNavigate();
  const location   = useLocation();
  const order      = location.state?.order || null;

  const [rating,      setRating]      = useState(0);
  const [description, setDescription] = useState('');
  const [name,        setName]        = useState('');
  const [file,        setFile]        = useState(null);
  const [preview,     setPreview]     = useState(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [error,       setError]       = useState('');

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!rating)            { setError('Please select a star rating.'); return; }
    if (!description.trim()) { setError('Please write a description.'); return; }
    if (!name.trim())        { setError('Please enter your display name.'); return; }
    setError('');
    setSubmitted(true);
    setTimeout(() => navigate('/account/orders'), 2000);
  };

  return (
    <div className="wr-page">

      {/* Success overlay */}
      {submitted && (
        <div className="wr-success-overlay">
          <div className="wr-success-box">
            <div className="wr-success-icon">✓</div>
            <h2 className="wr-success-title">Review Submitted!</h2>
            <p className="wr-success-msg">Thank you for your feedback. Redirecting back to orders…</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="wr-breadcrumb">
        <span onClick={() => navigate('/')} className="wr-bc-link">Home</span>
        <span className="wr-bc-sep">›</span>
        <span onClick={() => navigate('/account/orders')} className="wr-bc-link">My Orders</span>
        <span className="wr-bc-sep">›</span>
        <span className="wr-bc-current">Write a Review</span>
      </div>

      {/* Page title */}
      <div className="wr-page-header">
        <h1 className="wr-page-title">Write a Review</h1>
        <p className="wr-page-sub">Help other parents by sharing your experience with our premium collection.</p>
      </div>

      {/* Product info strip (if coming from order) */}
      {order && (
        <div className="wr-product-strip">
          <img src={order.image} alt={order.name} className="wr-product-img" />
          <div>
            <div className="wr-product-name">{order.name}</div>
            <div className="wr-product-meta">Color: {order.color} | Size: {order.size}</div>
          </div>
        </div>
      )}

      <div className="wr-body">

        {/* LEFT — tips */}
        <div className="wr-left">
          <div className="wr-tips-card">
            <div className="wr-tips-title">
              <span className="wr-tips-icon">💡</span> What makes a good review
            </div>
            <Accordion items={FAQ} />
          </div>

          <div className="wr-help-card">
            <div className="wr-help-top">
              <span className="wr-help-icon">ℹ</span>
              <div>
                <div className="wr-help-title">Need help with an order?</div>
                <div className="wr-help-sub">Contact our dedicated support team for issues with shipping, sizing, or returns.</div>
              </div>
            </div>
            <button className="wr-help-link" onClick={() => {}}>Visit Help Center</button>
          </div>
        </div>

        {/* RIGHT — review form */}
        <div className="wr-right">

          {/* Star rating */}
          <div className="wr-form-card">
            <div className="wr-rating-title">Rate this product</div>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Review form */}
          <div className="wr-form-card">
            <div className="wr-form-title">Review this product</div>

            <div className="wr-field">
              <label className="wr-label">Description</label>
              <textarea
                className="wr-textarea"
                placeholder="What did you like or dislike? How was the fit?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="wr-field">
              <label className="wr-label">Name</label>
              <input
                className="wr-input"
                type="text"
                placeholder="Your display name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="wr-field">
              <label className="wr-label">Add a photo or video</label>
              <label className="wr-upload-box">
                {preview ? (
                  <img src={preview} alt="preview" className="wr-upload-preview" />
                ) : (
                  <>
                    <span className="wr-upload-icon">📷</span>
                    <span className="wr-upload-text">Upload Photo or Video</span>
                  </>
                )}
                <input type="file" accept="image/*,video/*" onChange={handleFile} hidden />
              </label>
              <span className="wr-upload-hint">Accepted formats: JPG, PNG. Max size: 10MB</span>
            </div>

            {error && <div className="wr-error">{error}</div>}

            <button className="wr-submit-btn" onClick={handleSubmit}>
              SUBMIT REVIEW
            </button>
            <p className="wr-terms">
              By submitting, you agree to our <span className="wr-link">Terms of Use</span> and <span className="wr-link">Privacy Policy</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}