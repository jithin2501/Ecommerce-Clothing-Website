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
            <span className={`wr-faq-chevron ${open === i ? 'open' : ''}`} />
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
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || null;
  const item = location.state?.item || null;
  const initRating = location.state?.rating || 0;

  const [rating, setRating] = useState(initRating);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [files, setFiles] = useState([]); // Array of files
  const [previews, setPreviews] = useState([]); // Array of {url, type}
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 3) {
      setError('You can only upload up to 3 files (2 images and 1 video recommended).');
      return;
    }

    const newFiles = [...files, ...selected];
    const newPreviews = [...previews];

    selected.forEach(file => {
      newPreviews.push({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      });
    });

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const removeFile = (idx) => {
    setFiles(f => f.filter((_, i) => i !== idx));
    setPreviews(p => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a star rating.');
      return;
    }
    if (!description.trim()) {
      setError('Please write a description.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your display name.');
      return;
    }

    setError('');
    setSubmitting(true);
    const userId = localStorage.getItem('sumathi_uid');
    
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('rating', Number(rating));
      formData.append('message', description.trim());
      formData.append('productId', item?.productId || '');
      formData.append('orderId', order?.displayId || '');
      formData.append('uid', userId || '');
      
      files.forEach(f => {
        formData.append('media', f);
      });

      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="wr-page wr-success-page">
        <div className="wr-success-card">
          <div className="wr-success-check">✓</div>
          <h1 className="wr-success-title">Review Submitted!</h1>
          <p className="wr-success-desc">
            Thank you for your feedback! Your review is now **awaiting admin approval**. 
            Once approved, it will be visible on the product page.
          </p>
          <button className="wr-back-btn" onClick={() => navigate('/account/orders')}>
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wr-page">
      <div className="wr-breadcrumb">
        <span onClick={() => navigate('/')} className="wr-bc-link">Home</span>
        <span className="wr-bc-sep">›</span>
        <span onClick={() => navigate('/account/orders')} className="wr-bc-link">My Orders</span>
        <span className="wr-bc-sep">›</span>
        <span className="wr-bc-current">Write a Review</span>
      </div>

      <div className="wr-header-center">
        <h1 className="wr-page-title">Write a Review</h1>

        {item && (
          <div className="wr-product-strip">
            <img
              src={item.img || item.photo}
              alt={item.name}
              className="wr-product-img"
            />
            <div className="wr-product-info">
              <div className="wr-product-name">{item.name}</div>
              <div className="wr-product-meta">
                {item.color && `Color: ${item.color}`}{item.size && ` | Size: ${item.size}`}
              </div>
              <div className="wr-product-price">
                ₹{item.price}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="wr-body">
        <div className="wr-left">
          <div className="wr-tips-card">
            <div className="wr-tips-title">What makes a good review</div>
            <Accordion items={FAQ} />
          </div>
        </div>

        <div className="wr-right">
          <div className="wr-form-card">
            <div className="wr-rating-title">Rate this product</div>
            <StarRating value={rating} onChange={setRating} />
          </div>

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
                onChange={(e) => setName(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
              />
            </div>

            <div className="wr-field">
              <label className="wr-label">Add photos or video (Max 3)</label>
              <div className="wr-media-grid">
                {previews.map((prev, idx) => (
                  <div key={idx} className="wr-media-preview-box">
                    <button className="wr-media-remove" onClick={() => removeFile(idx)}>×</button>
                    {prev.type === 'video' ? (
                      <video src={prev.url} className="wr-preview-img" />
                    ) : (
                      <img src={prev.url} alt="preview" className="wr-preview-img" />
                    )}
                  </div>
                ))}
                
                {previews.length < 3 && (
                  <label className="wr-upload-placeholder">
                    <span className="wr-upload-icon">+</span>
                    <input type="file" accept="image/*,video/*" multiple onChange={handleFiles} hidden />
                  </label>
                )}
              </div>
              <span className="wr-upload-hint">Upload up to 2 images and 1 video for best visibility.</span>
            </div>

            {error && <div className="wr-error">{error}</div>}

            <button className="wr-submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}