// ── admin/views/ProductManagement.jsx ──
import { useEffect, useState, useRef } from 'react';
import '../assets/productmanagement.css';

const API = 'http://localhost:5000/api/products';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

const AGE_GROUPS = [
  { value: 'newborn', label: 'Newborn (0-2Y)' },
  { value: 'toddler', label: 'Toddler (3-6Y)' },
  { value: 'junior',  label: 'Junior (7-12Y)'  },
];
const AGE_LABELS = { newborn: '0-2Y', toddler: '3-6Y', junior: '7-12Y' };
const CATEGORIES = [
  'Baby Frocks', 'Birthday Frocks', 'Tops & T-Shirts',
  'Indo-Western Outfits', 'Traditional Outfits', 'Party Wear', 'Boys Collection',
];
const BADGES = ['', 'New', 'Bestselling'];

const EMPTY_FORM = { name: '', category: '', price: '', oldPrice: '', ageGroup: 'newborn', color: '', badge: '' };

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [preview, setPreview]   = useState(null);
  const [imgFile, setImgFile]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [filterAge, setFilterAge] = useState('all');
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
      name: p.name, category: p.category, price: p.price,
      oldPrice: p.oldPrice || '', ageGroup: p.ageGroup,
      color: p.color || '', badge: p.badge || '',
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
    if (!form.name || !form.category || !form.price) { setError('Name, category and price are required.'); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('age', AGE_LABELS[form.ageGroup]);
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
    const matchAge  = filterAge === 'all' || p.ageGroup === filterAge;
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
    return (
      <button className="pm-feat-circle" onClick={() => handleFeaturedToggle(id, section, active)}>
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
              {preview && (
                <button type="button" className="pm-red-btn" onClick={handleRemoveImage}>Remove Image</button>
              )}
            </div>

            <div className="pm-fields">
              <div className="pm-row">
                <div className="pm-group">
                  <label>Product Name *</label>
                  <input type="text" placeholder="e.g. Garden Breeze Dress"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="pm-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pm-row">
                <div className="pm-group">
                  <label>Price (₹) *</label>
                  <input type="number" placeholder="e.g. 849" min="0"
                    value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="pm-group">
                  <label>Old Price (₹) <span className="pm-optional">optional</span></label>
                  <input type="number" placeholder="e.g. 1200" min="0"
                    value={form.oldPrice} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} />
                </div>
              </div>

              <div className="pm-row">
                <div className="pm-group">
                  <label>Age Group *</label>
                  <select value={form.ageGroup} onChange={e => setForm(f => ({ ...f, ageGroup: e.target.value }))}>
                    {AGE_GROUPS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div className="pm-group">
                  <label>Badge <span className="pm-optional">optional</span></label>
                  <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}>
                    {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                  </select>
                </div>
              </div>

              <div className="pm-row">
                <div className="pm-group">
                  <label>Color <span className="pm-optional">optional</span></label>
                  <input type="text" placeholder="e.g. pink, blue"
                    value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
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
              {['all', 'newborn', 'toddler', 'junior'].map(f => (
                <button key={f}
                  className={`pm-filter-btn${filterAge === f ? ' active' : ''}`}
                  onClick={() => setFilterAge(f)}>
                  {f === 'all' ? 'All' : AGE_GROUPS.find(a => a.value === f)?.label}
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
                      <span>Coll |</span>
                      <span>Detail |</span>
                      <span>Cart</span>
                    </div>
                  </th>
                  <th>BEST SELLING</th>
                  <th>NEW ARRIVALS</th>
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
                      <div className="pm-cat">{p.category}</div>
                    </td>
                    <td className="pm-age">{p.age}</td>
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
                        {['currentFavorites', 'youMightAlsoLike', 'cartAlsoLike'].map(key => (
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
                        <button className="pm-details-btn">
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