// ── admin/views/ProductManagement.jsx ──
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/productmanagement.css';

const API = '/api/products';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

const AGE_GROUPS = [
  { value: 'newborn',      label: '0–6 Months (Newborn)' },
  { value: 'infant',       label: '6–12 Months (Infant)' },
  { value: 'toddler',      label: '1–3 Years (Toddler)' },
  { value: 'little-girls', label: '3–6 Years (Little Girls)' },
  { value: 'kids',         label: '6–9 Years (Kids)' },
  { value: 'pre-teen',     label: '9–12 Years (Pre-Teen)' },
];
const AGE_LABELS = {
  'newborn': '0–6 Months', 'infant': '6–12 Months', 'toddler': '1–3 Years', 
  'little-girls': '3–6 Years', 'kids': '6–9 Years', 'pre-teen': '9–12 Years'
};
const CATEGORIES = [
  'Occasion & Daily Wear Frocks',
  'Party Wear Collection',
  'Designer & Premium Frocks',
  'Traditional & Ethnic Frocks',
  'Fabric-Based Categories'
];
const SUBCATEGORIES = {
  'Occasion & Daily Wear Frocks': [
    'Birthday Party Frocks', 'Wedding / Festive Frocks', 'Reception / Evening Wear',
    'Photoshoot Special Frocks', 'Princess / Fancy Dress', 'Casual Cotton Frocks',
    'Playtime Frocks', 'School Casual Frocks', 'Summer Wear Frocks', 'Comfortable Home Wear'
  ],
  'Party Wear Collection': [
    'Net Frocks', 'Gown Style Frocks', 'Layered / Frill Frocks', 
    'Sequin / Glitter Frocks', 'Designer Party Wear'
  ],
  'Designer & Premium Frocks': [
    'Boutique Designer Frocks', 'Handwork / Embroidery Frocks', 
    'Custom Made Frocks', 'Luxury Collection'
  ],
  'Traditional & Ethnic Frocks': [
    'Pattu / Silk Frocks', 'Lehenga Style Frocks', 'Anarkali Frocks', 
    'Indo-Western Styles', 'Festival Special (Diwali, Navratri, etc.)'
  ],
  'Fabric-Based Categories': [
    'Cotton Frocks', 'Net Frocks', 'Satin Frocks', 'Silk Frocks', 
    'Organza Frocks', 'Velvet Frocks (Winter Special)'
  ]
};
const BADGES = ['', 'New', 'Bestselling'];
const EMPTY_FORM = { 
  name: '', 
  category: [], 
  subCategory: [], 
  price: '', 
  oldPrice: '', 
  ageGroup: [], 
  color: '', 
  badge: '' 
};

const SECTION_LIMITS = {
  currentFavorites: 4,
  youMightAlsoLike: 4,
  cartAlsoLike:     4,
  bestSelling:      10,
  newArrivals:      4,
};

export default function ProductManagement() {
  const navigate = useNavigate();                          // ← only addition

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editId, setEditId]         = useState(null);
  const [preview, setPreview]       = useState(null);
  const [imgFile, setImgFile]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [filterAge, setFilterAge]   = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate]   = useState('');
  const fileRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res  = await fetch(`${API}/admin`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch { setError('Failed to load products.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImgFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, 
      category: Array.isArray(p.category) ? p.category : [p.category], 
      subCategory: Array.isArray(p.subCategory) ? p.subCategory : (p.subCategory ? [p.subCategory] : []), 
      price: p.price,
      oldPrice: p.oldPrice || '', 
      ageGroup: Array.isArray(p.ageGroup) ? p.ageGroup : [p.ageGroup],
      color: p.color || '', 
      badge: p.badge || '',
    });
    setPreview(p.img);
    setImgFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setPreview(null);
    setImgFile(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!editId && !imgFile) { setError('Please select a product image.'); return; }
    if (!form.name || !form.category || !form.subCategory || !form.price) { setError('Name, category, sub-category, and price are required.'); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });
      
      const ageLabels = form.ageGroup.map(ag => AGE_LABELS[ag]).join(', ');
      fd.append('age', ageLabels);
      if (imgFile) fd.append('image', imgFile);

      const url    = editId ? `${API}/admin/${editId}` : `${API}/admin`;
      const method = editId ? 'PATCH' : 'POST';
      const res    = await fetch(url, { method, headers: authHeaders(), body: fd });
      const data   = await res.json();

      if (data.success) {
        if (editId) {
          setProducts(p => p.map(x => x._id === editId ? data.data : x));
        } else {
          setProducts(p => [data.data, ...p]);
        }
        handleCancel();
      } else {
        setError(data.message || 'Failed to save product.');
      }
    } catch { setError('Server error.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will also remove the image from storage.`)) return;
    try {
      const res  = await fetch(`${API}/admin/${id}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) setProducts(p => p.filter(x => x._id !== id));
    } catch { setError('Server error.'); }
  };

  const handleFeaturedToggle = async (id, section, isCurrentlyOn) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    const current = product.featuredIn || [];
    const updated = isCurrentlyOn
      ? current.filter(s => s !== section)
      : [...current, section];

    if (!isCurrentlyOn) {
      const limit = SECTION_LIMITS[section];
      const currentCount = products.filter(p =>
        (p.featuredIn || []).includes(section)
      ).length;
      if (currentCount >= limit) {
        setError(`Maximum ${limit} products allowed in this section. Remove one first.`);
        return;
      }
    }

    setError('');
    setProducts(prev =>
      prev.map(x => x._id === id ? { ...x, featuredIn: updated } : x)
    );

    try {
      const res = await fetch(`${API}/admin/${id}`, {
        method: 'PATCH',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ featuredIn: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(x => x._id === id ? data.data : x));
      } else {
        setProducts(prev =>
          prev.map(x => x._id === id ? { ...x, featuredIn: current } : x)
        );
        setError(data.message || 'Failed to update.');
      }
    } catch {
      setProducts(prev =>
        prev.map(x => x._id === id ? { ...x, featuredIn: current } : x)
      );
      setError('Server error.');
    }
  };

  const displayed = products.filter(p => {
    const pAges = Array.isArray(p.ageGroup) ? p.ageGroup : [p.ageGroup];
    const matchAge  = filterAge === 'all' || pAges.includes(filterAge);
    const matchName = searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchDate = filterDate === '' || (() => {
      if (!p.createdAt) return false;
      const created = new Date(p.createdAt).toISOString().slice(0, 10);
      return created === filterDate;
    })();
    return matchAge && matchName && matchDate;
  });

  const FeatToggle = ({ id, section, featuredIn }) => {
    const active = (featuredIn || []).includes(section);
    const limit = SECTION_LIMITS[section];
    const currentCount = products.filter(p =>
      (p.featuredIn || []).includes(section)
    ).length;
    const isDisabled = !active && currentCount >= limit;

    return (
      <button
        className={`pm-feat-circle${isDisabled ? ' pm-feat-disabled' : ''}`}
        onClick={() => !isDisabled && handleFeaturedToggle(id, section, active)}
        title={isDisabled ? `Max ${limit} allowed` : ''}
      >
        <img
          src={active ? '/images/ProductManagement/tick.png' : '/images/ProductManagement/cross.png'}
          alt={active ? 'on' : 'off'}
        />
      </button>
    );
  };

  return (
    <div className="pm-page">
      <h1 className="pm-title">Product Management</h1>

      <div className="pm-form-card">
        <h3 className="pm-form-title">{editId ? 'Edit Product' : 'Add New Product'}</h3>

        {error && <div className="pm-error">{error}</div>}

        <form className="pm-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="pm-form-grid">

            <div className="pm-img-col">
              <div className="pm-img-upload" onClick={() => fileRef.current.click()}>
                {preview
                  ? <img src={preview} alt="preview" className="pm-img-preview" />
                  : <div className="pm-img-placeholder">+ Upload Image</div>
                }
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImgChange} style={{ display: 'none' }} />
              </div>
            </div>

            <div className="pm-fields">
              <div className="pm-row">
                <div className="pm-group">
                  <label>Product Name *</label>
                  <input type="text" placeholder="e.g. Garden Breeze Dress"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
              </div>

              <div className="pm-row pm-compact-row">
                <div className="pm-group">
                  <label>Categories *</label>
                  <div className="pm-chip-grid">
                    {CATEGORIES.map(c => {
                      const isActive = form.category.includes(c);
                      return (
                        <div key={c} className={`pm-chip pm-sm ${isActive ? 'active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, category: isActive ? f.category.filter(x => x !== c) : [...f.category, c] }))}>
                          {c}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="pm-group">
                  <label>Age Groups *</label>
                  <div className="pm-chip-grid">
                    {AGE_GROUPS.map(a => {
                      const isActive = form.ageGroup.includes(a.value);
                      return (
                        <div key={a.value} className={`pm-chip pm-sm ${isActive ? 'active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, ageGroup: isActive ? f.ageGroup.filter(x => x !== a.value) : [...f.ageGroup, a.value] }))}>
                          {a.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {form.category.length > 0 && (
                <div className="pm-group pm-subcat-simple">
                  <label>Sub Categories *</label>
                  <div className="pm-chip-grid pm-compact-chips">
                    {[...new Set(form.category.flatMap(cat => SUBCATEGORIES[cat] || []))].map(sc => {
                      const isActive = form.subCategory.includes(sc);
                      return (
                        <div key={sc} className={`pm-chip pm-xs ${isActive ? 'active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, subCategory: isActive ? f.subCategory.filter(x => x !== sc) : [...f.subCategory, sc] }))}>
                          {sc}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pm-row">
                <div className="pm-group">
                  <label>Price (₹) <span className="pm-required">*</span></label>
                  <input type="number" placeholder="e.g. 849" min="0" className="pm-premium-input"
                    value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="pm-group">
                  <label>Badge <span className="pm-optional">optional</span></label>
                  <select value={form.badge} className="pm-premium-select" onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                    {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                  </select>
                </div>
              </div>


            </div>
          </div>

          <div className="pm-form-actions">
            {editId && <button type="button" className="pm-cancel-btn" onClick={handleCancel}>Cancel</button>}
            <button type="submit" className="pm-save-btn" disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      <div className="pm-existing-card">
        <div className="pm-section-header">
          <div className="pm-section-title-wrap">
            <h2 className="pm-section-title">Existing Products</h2>
            <span className="pm-section-count">{displayed.length} product{displayed.length !== 1 ? 's' : ''} found</span>
          </div>

          <div className="pm-section-controls">
            <div className="pm-search-wrap">
              <input
                type="text"
                className="pm-search-input"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="button" className="pm-search-btn">
                <img src="/images/ProductManagement/search.png" alt="Search" />
              </button>
            </div>

            <div className="pm-age-filters">
              {['all', 'newborn', 'infant', 'toddler', 'little-girls', 'kids', 'pre-teen'].map(f => (
                <button key={f}
                  className={`pm-filter-btn${filterAge === f ? ' active' : ''}`}
                  onClick={() => setFilterAge(f)}>
                  {f === 'all' ? 'All' : AGE_LABELS[f]}
                </button>
              ))}
            </div>

            <input
              type="date"
              className="pm-date-filter"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="pm-table-outer">
          {loading ? <p className="pm-empty">Loading...</p>
            : displayed.length === 0 ? <p className="pm-empty">No products found.</p>
            : (
            <table className="pm-table">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>NAME & CATEGORY</th>
                  <th>AGE</th>
                  <th>PRICE</th>
                  <th>BADGE</th>
                  <th className="pm-th-featured">
                    <div className="pm-th-feat-wrap">
                      <span>Detail (4) |</span>
                      <span>Cart (4)</span>
                    </div>
                  </th>
                  <th>BEST SELLING (10)</th>
                  <th>NEW ARRIVALS (4)</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.img} alt={p.name} className="pm-thumb" /></td>
                    <td>
                      <div className="pm-name">{p.name}</div>
                      <div className="pm-cat">{(Array.isArray(p.category) ? p.category : [p.category]).join(', ')}</div>
                      {p.subCategory && <div className="pm-subcat" style={{fontSize: '0.8rem', color: '#666', marginTop: '2px'}}>
                        {(Array.isArray(p.subCategory) ? p.subCategory : [p.subCategory]).join(', ')}
                      </div>}
                    </td>
                    <td className="pm-age">
                      <div className="pm-age-grid">
                        {p.age ? p.age.split(', ').map((age, i) => {
                          const shortAge = age
                            .replace(/years?/gi, 'Y')
                            .replace(/months?/gi, 'M');
                          return (
                            <span key={i} className="pm-age-tag">{shortAge}</span>
                          );
                        }) : '—'}
                      </div>
                    </td>
                    <td className="pm-price">
                      ₹{p.price}
                      {p.oldPrice && <><br /><span className="pm-old-price">₹{p.oldPrice}</span></>}
                    </td>
                    <td>
                      {p.badge
                        ? <span className={`pm-badge pm-badge-${p.badge.toLowerCase()}`}>{p.badge}</span>
                        : <span className="pm-badge-none">—</span>}
                    </td>
                    <td className="pm-td-featured">
                      <div className="pm-feat-icons">
                        {['youMightAlsoLike', 'cartAlsoLike'].map(key => (
                          <FeatToggle key={key} id={p._id} section={key} featuredIn={p.featuredIn} />
                        ))}
                      </div>
                    </td>
                    <td className="pm-td-center">
                      <div className="pm-feat-icons">
                        <FeatToggle id={p._id} section="bestSelling" featuredIn={p.featuredIn} />
                      </div>
                    </td>
                    <td className="pm-td-center">
                      <div className="pm-feat-icons">
                        <FeatToggle id={p._id} section="newArrivals" featuredIn={p.featuredIn} />
                      </div>
                    </td>
                    <td>
                      <span className={`pm-status ${p.isActive ? 'active' : 'inactive'}`}>
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="pm-actions">
                        <button className="pm-edit-btn" onClick={() => handleEdit(p)}>
                          <img src="/images/ProductManagement/edit.png" alt="Edit" />
                        </button>
                        <button                                                       
                          className="pm-details-btn"
                          onClick={() => navigate(`/admin/products/${p._id}/details`)}
                        >
                          <img src="/images/ProductManagement/details.png" alt="Details" />
                        </button>
                        <button className="pm-del-btn" onClick={() => handleDelete(p._id, p.name)}>
                          <img src="/images/ProductManagement/delete.png" alt="Delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
