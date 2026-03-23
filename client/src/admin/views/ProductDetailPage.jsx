// ── admin/views/ProductDetailPage.jsx ──
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/productdetailpage.css';

const API      = 'http://localhost:5000/api';
const authHdrs = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

const MAX_GALLERY = 7;

const EMPTY_SPEC  = { label: '', value: '' };
const EMPTY_COLOR = { name: '', hex: '#F2C4B0' };

/* ── tiny helpers ── */
const uuid = () => Math.random().toString(36).slice(2, 9);

export default function ProductDetailPage() {
  const { productId } = useParams();   // /admin/products/:productId/details
  const navigate      = useNavigate();

  /* ── product info (read-only) ── */
  const [product, setProduct] = useState(null);

  /* ── gallery slots: array of { id, file?, preview, url? } (max 7) ── */
  const [gallery, setGallery] = useState([]);
  const fileRefs = useRef([]);           // one ref per slot

  /* ── right-panel fields ── */
  const [sizes,            setSizes]           = useState(['']);
  const [colors,           setColors]          = useState([{ ...EMPTY_COLOR, id: uuid() }]);
  const [deliveryDate,     setDeliveryDate]    = useState('');

  /* ── accordion fields ── */
  const [specifications,   setSpecifications]  = useState([{ ...EMPTY_SPEC, id: uuid() }]);
  const [description,      setDescription]     = useState('');
  const [manufacturerInfo, setManufacturerInfo] = useState([{ ...EMPTY_SPEC, id: uuid() }]);
  const [highlights,       setHighlights]       = useState([{ ...EMPTY_SPEC, id: uuid() }]);

  /* ── ui state ── */
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  /* ────────────────────────────────────
     Load product + existing detail
  ──────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      try {
        // fetch product base info
        const pRes  = await fetch(`${API}/products/admin`, { headers: authHdrs() });
        const pData = await pRes.json();
        if (pData.success) {
          const p = pData.data.find(x => x._id === productId);
          setProduct(p || null);
        }

        // fetch existing detail
        const dRes  = await fetch(`${API}/product-details/admin/${productId}`, { headers: authHdrs() });
        const dData = await dRes.json();
        if (dData.success && dData.data) {
          const d = dData.data;
          // gallery
          const slots = (d.galleryImages || []).map(url => ({ id: uuid(), url, preview: url, file: null }));
          setGallery(slots);
          // sizes
          if (d.sizes?.length) setSizes(d.sizes);
          // colors
          if (d.colors?.length) setColors(d.colors.map(c => ({ ...c, id: uuid() })));
          // delivery
          setDeliveryDate(d.deliveryDate || '');
          // specs
          if (d.specifications?.length) setSpecifications(d.specifications.map(s => ({ ...s, id: uuid() })));
          setDescription(d.description || '');
          if (d.manufacturerInfo?.length) setManufacturerInfo(d.manufacturerInfo.map(s => ({ ...s, id: uuid() })));
          if (d.highlights?.length) setHighlights(d.highlights.map(s => ({ ...s, id: uuid() })));
        }
      } catch {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  /* ────────────────────────────────────
     Gallery helpers
  ──────────────────────────────────── */
  const addGallerySlot = () => {
    if (gallery.length >= MAX_GALLERY) return;
    setGallery(g => [...g, { id: uuid(), file: null, preview: null, url: null }]);
  };

  const handleGalleryFile = (idx, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setGallery(g => g.map((s, i) => i === idx ? { ...s, file, preview } : s));
  };

  const removeGallerySlot = (idx) => {
    setGallery(g => g.filter((_, i) => i !== idx));
  };

  /* ────────────────────────────────────
     Generic row helpers (specs / highlights / mfr)
  ──────────────────────────────────── */
  const makeRowHelpers = (setter) => ({
    add:    ()          => setter(r => [...r, { ...EMPTY_SPEC, id: uuid() }]),
    remove: (id)        => setter(r => r.filter(x => x.id !== id)),
    update: (id, k, v)  => setter(r => r.map(x => x.id === id ? { ...x, [k]: v } : x)),
  });

  const spec = makeRowHelpers(setSpecifications);
  const mfr  = makeRowHelpers(setManufacturerInfo);
  const hl   = makeRowHelpers(setHighlights);

  /* ────────────────────────────────────
     Size helpers
  ──────────────────────────────────── */
  const addSize    = ()        => setSizes(s => [...s, '']);
  const removeSize = (i)       => setSizes(s => s.filter((_, idx) => idx !== i));
  const updateSize = (i, v)    => setSizes(s => s.map((x, idx) => idx === i ? v : x));

  /* ────────────────────────────────────
     Color helpers
  ──────────────────────────────────── */
  const addColor    = ()         => setColors(c => [...c, { ...EMPTY_COLOR, id: uuid() }]);
  const removeColor = (id)       => setColors(c => c.filter(x => x.id !== id));
  const updateColor = (id, k, v) => setColors(c => c.map(x => x.id === id ? { ...x, [k]: v } : x));

  /* ────────────────────────────────────
     Submit
  ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validGallery = gallery.filter(s => s.file || s.url);
    if (validGallery.length === 0) {
      setError('Please add at least one gallery image.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();

      // gallery: new files go as image_0 … image_N in their slot position
      // existing URLs go as a JSON array
      const existingUrls = [];
      gallery.forEach((slot, i) => {
        if (slot.file) {
          fd.append(`image_${i}`, slot.file);
          existingUrls.push(null);   // placeholder so indices align
        } else {
          existingUrls.push(slot.url || null);
        }
      });
      fd.append('existingUrls', JSON.stringify(existingUrls));

      fd.append('sizes',            JSON.stringify(sizes.filter(Boolean)));
      fd.append('colors',           JSON.stringify(colors.map(({ id, ...rest }) => rest)));
      fd.append('deliveryDate',     deliveryDate);
      fd.append('specifications',   JSON.stringify(specifications.map(({ id, ...r }) => r).filter(r => r.label)));
      fd.append('description',      description);
      fd.append('manufacturerInfo', JSON.stringify(manufacturerInfo.map(({ id, ...r }) => r).filter(r => r.label)));
      fd.append('highlights',       JSON.stringify(highlights.map(({ id, ...r }) => r).filter(r => r.label)));

      const res  = await fetch(`${API}/product-details/admin/${productId}`, {
        method:  'POST',
        headers: authHdrs(),
        body:    fd,
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Product details saved successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.message || 'Failed to save.');
      }
    } catch {
      setError('Server error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pdp-loading">Loading…</div>;

  return (
    <div className="pdp-page">

      {/* Header */}
      <div className="pdp-header">
        <button className="pdp-back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <div>
          <h1 className="pdp-title">Product Details</h1>
          {product && <p className="pdp-subtitle">{product.name}</p>}
        </div>
      </div>

      {error   && <div className="pdp-alert pdp-alert-error">{error}</div>}
      {success && <div className="pdp-alert pdp-alert-success">{success}</div>}

      <form className="pdp-form" onSubmit={handleSubmit}>

        {/* ── TOP PREVIEW GRID (mirrors CollectionDetailPage layout) ── */}
        <div className="pdp-preview-grid">

          {/* LEFT — Gallery */}
          <div className="pdp-gallery-section">
            <h2 className="pdp-section-title">Gallery Images</h2>
            <p className="pdp-section-hint">Add 1–7 images. First image is the main display image.</p>

            {/* Main slot (index 0) */}
            <div className="pdp-main-slot">
              {gallery[0]?.preview ? (
                <div className="pdp-main-preview">
                  <img src={gallery[0].preview} alt="Main" />
                  <button type="button" className="pdp-slot-remove" onClick={() => removeGallerySlot(0)}>✕</button>
                </div>
              ) : (
                <label className="pdp-main-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files[0];
                      if (!f) return;
                      if (gallery.length === 0) {
                        setGallery([{ id: uuid(), file: f, preview: URL.createObjectURL(f), url: null }]);
                      } else {
                        handleGalleryFile(0, f);
                      }
                    }}
                  />
                  <div className="pdp-upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <span className="pdp-upload-text">Upload Main Image</span>
                </label>
              )}
            </div>

            {/* Thumbnails row — slots 1-6 */}
            <div className="pdp-thumb-row">
              {Array.from({ length: 6 }).map((_, relIdx) => {
                const absIdx = relIdx + 1;
                const slot   = gallery[absIdx];
                return (
                  <div key={absIdx} className="pdp-thumb-slot">
                    {slot?.preview ? (
                      <div className="pdp-thumb-preview">
                        <img src={slot.preview} alt={`Gallery ${absIdx + 1}`} />
                        <button type="button" className="pdp-thumb-remove" onClick={() => removeGallerySlot(absIdx)}>✕</button>
                      </div>
                    ) : (
                      gallery.length >= absIdx && gallery.length < MAX_GALLERY ? (
                        <label className="pdp-thumb-upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => {
                              const f = e.target.files[0];
                              if (!f) return;
                              if (gallery.length <= absIdx) {
                                setGallery(g => [...g, { id: uuid(), file: f, preview: URL.createObjectURL(f), url: null }]);
                              } else {
                                handleGalleryFile(absIdx, f);
                              }
                            }}
                          />
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </label>
                      ) : (
                        <div className="pdp-thumb-empty" />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Product info fields */}
          <div className="pdp-right-fields">

            {/* Product name — read-only, pulled from Product */}
            <div className="pdp-field-group">
              <label className="pdp-label">PRODUCT NAME</label>
              <div className="pdp-readonly-value">{product?.name || '—'}</div>
            </div>

            {/* Rating — static, no change */}
            <div className="pdp-field-group">
              <label className="pdp-label">RATING</label>
              <div className="pdp-stars-preview">★★★★☆ <span className="pdp-reviews-hint">(42 Reviews)</span></div>
            </div>

            {/* Sizes */}
            <div className="pdp-field-group">
              <label className="pdp-label">SIZES</label>
              <div className="pdp-sizes-list">
                {sizes.map((s, i) => (
                  <div key={i} className="pdp-size-row">
                    <input
                      className="pdp-size-input"
                      type="text"
                      placeholder="e.g. 4-5Y"
                      value={s}
                      onChange={e => updateSize(i, e.target.value)}
                    />
                    <button type="button" className="pdp-row-remove" onClick={() => removeSize(i)}>✕</button>
                  </div>
                ))}
                <button type="button" className="pdp-add-row-btn" onClick={addSize}>+ Add Size</button>
              </div>
            </div>

            {/* Colors */}
            <div className="pdp-field-group">
              <label className="pdp-label">COLORS</label>
              <div className="pdp-colors-list">
                {colors.map(c => (
                  <div key={c.id} className="pdp-color-row">
                    <input
                      type="color"
                      className="pdp-color-picker"
                      value={c.hex}
                      onChange={e => updateColor(c.id, 'hex', e.target.value)}
                    />
                    <input
                      className="pdp-color-name-input"
                      type="text"
                      placeholder="Color name (e.g. blush)"
                      value={c.name}
                      onChange={e => updateColor(c.id, 'name', e.target.value)}
                    />
                    <button type="button" className="pdp-row-remove" onClick={() => removeColor(c.id)}>✕</button>
                  </div>
                ))}
                <button type="button" className="pdp-add-row-btn" onClick={addColor}>+ Add Color</button>
              </div>
            </div>

            {/* Delivery date */}
            <div className="pdp-field-group">
              <label className="pdp-label">DELIVERY DATE</label>
              <input
                className="pdp-input"
                type="text"
                placeholder="e.g. 5 Mar, Thu"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* ── ACCORDION SECTION ── */}
        <div className="pdp-accordion-section">
          <h2 className="pdp-section-title">Product Details (Accordion)</h2>

          {/* Specifications */}
          <div className="pdp-accordion-block">
            <h3 className="pdp-accordion-heading">Specifications</h3>
            <div className="pdp-kv-grid pdp-kv-header">
              <span>Label</span><span>Value</span><span />
            </div>
            {specifications.map(s => (
              <div key={s.id} className="pdp-kv-grid">
                <input className="pdp-kv-input" placeholder="e.g. Brand" value={s.label} onChange={e => spec.update(s.id, 'label', e.target.value)} />
                <input className="pdp-kv-input" placeholder="e.g. Sumathi Trends" value={s.value} onChange={e => spec.update(s.id, 'value', e.target.value)} />
                <button type="button" className="pdp-row-remove" onClick={() => spec.remove(s.id)}>✕</button>
              </div>
            ))}
            <button type="button" className="pdp-add-row-btn" onClick={spec.add}>+ Add Row</button>
          </div>

          {/* Description */}
          <div className="pdp-accordion-block">
            <h3 className="pdp-accordion-heading">Description</h3>
            <textarea
              className="pdp-textarea"
              rows={5}
              placeholder="Enter product description…"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Manufacturer Info */}
          <div className="pdp-accordion-block">
            <h3 className="pdp-accordion-heading">Manufacturer Info</h3>
            <div className="pdp-kv-grid pdp-kv-header">
              <span>Label</span><span>Value</span><span />
            </div>
            {manufacturerInfo.map(s => (
              <div key={s.id} className="pdp-kv-grid">
                <input className="pdp-kv-input" placeholder="e.g. Country of Origin" value={s.label} onChange={e => mfr.update(s.id, 'label', e.target.value)} />
                <input className="pdp-kv-input" placeholder="e.g. India" value={s.value} onChange={e => mfr.update(s.id, 'value', e.target.value)} />
                <button type="button" className="pdp-row-remove" onClick={() => mfr.remove(s.id)}>✕</button>
              </div>
            ))}
            <button type="button" className="pdp-add-row-btn" onClick={mfr.add}>+ Add Row</button>
          </div>

          {/* Highlights */}
          <div className="pdp-accordion-block">
            <h3 className="pdp-accordion-heading">Product Highlights</h3>
            <div className="pdp-kv-grid pdp-kv-header">
              <span>Label (e.g. SLEEVE TYPE)</span><span>Value (e.g. Flutter Sleeve)</span><span />
            </div>
            {highlights.map(h => (
              <div key={h.id} className="pdp-kv-grid">
                <input className="pdp-kv-input" placeholder="e.g. MATERIAL" value={h.label} onChange={e => hl.update(h.id, 'label', e.target.value)} />
                <input className="pdp-kv-input" placeholder="e.g. Pure Organic Cotton" value={h.value} onChange={e => hl.update(h.id, 'value', e.target.value)} />
                <button type="button" className="pdp-row-remove" onClick={() => hl.remove(h.id)}>✕</button>
              </div>
            ))}
            <button type="button" className="pdp-add-row-btn" onClick={hl.add}>+ Add Row</button>
          </div>
        </div>

        {/* Save */}
        <div className="pdp-form-actions">
          <button type="button" className="pdp-cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="pdp-save-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save Details'}
          </button>
        </div>

      </form>
    </div>
  );
}