import { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../styles/manageaddresses/ManageAddresses.css';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

const emptyForm = {
  fullName: '', mobile: '', pincode: '', locality: '',
  address: '', city: '', state: '', landmark: '', altPhone: '', type: ''
};

export default function ManageAddresses() {
  const [activeNav, setActiveNav]       = useState('account-settings');
  const [activeSubNav, setActiveSubNav] = useState('address');
  const [form, setForm]                 = useState(emptyForm);
  const [errors, setErrors]             = useState({});
  const [addresses, setAddresses_] = useState(() => {
    try {
      const saved = localStorage.getItem('sumathi_addresses');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const setAddresses = (updater) => {
    setAddresses_(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem('sumathi_addresses', JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const [saved, setSaved]               = useState(false);
  const [menuOpen, setMenuOpen]         = useState(null); // address id with open menu
  const [editingId, setEditingId]       = useState(null); // id being edited

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())          e.fullName = 'Required';
    if (!/^\d{10}$/.test(form.mobile))  e.mobile   = '10-digit number required';
    if (!/^\d{6}$/.test(form.pincode))  e.pincode  = '6-digit pincode required';
    if (!form.locality.trim())          e.locality  = 'Required';
    if (!form.address.trim())           e.address   = 'Required';
    if (!form.city.trim())              e.city      = 'Required';
    if (!form.state)                    e.state     = 'Select a state';
    if (!form.type)                     e.type      = 'Select address type';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (editingId !== null) {
      // Update existing
      setAddresses(a => a.map(x => x.id === editingId ? {
        ...x,
        type: form.type.toUpperCase(),
        name: form.fullName, phone: form.mobile,
        line1: form.address,
        line2: `${form.locality}, ${form.city}, ${form.state} -`,
        pincode: form.pincode,
        landmark: form.landmark, altPhone: form.altPhone
      } : x));
      setEditingId(null);
    } else {
      // Add new
      setAddresses(a => [...a, {
        id: Date.now(),
        type: form.type.toUpperCase(),
        name: form.fullName, phone: form.mobile,
        line1: form.address,
        line2: `${form.locality}, ${form.city}, ${form.state} -`,
        pincode: form.pincode,
        landmark: form.landmark, altPhone: form.altPhone
      }]);
    }

    setForm(emptyForm);
    setErrors({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (addr) => {
    const [locality, rest] = addr.line2.split(', ').reduce((acc, part, i) => {
      if (i === 0) acc[0] = part;
      else acc[1] = (acc[1] ? acc[1] + ', ' : '') + part;
      return acc;
    }, ['', '']);
    const statePart = rest ? rest.replace(' -', '').trim() : '';
    const cityPart  = addr.line2.split(', ')[1] || '';

    setForm({
      fullName: addr.name,
      mobile: addr.phone,
      pincode: addr.pincode,
      locality: addr.line2.split(', ')[0] || '',
      address: addr.line1.replace(/,$/, '').trim(),
      city: addr.line2.split(', ')[1] || '',
      state: addr.line2.split(', ')[2]?.replace(' -', '').trim() || '',
      landmark: addr.landmark || '',
      altPhone: addr.altPhone || '',
      type: addr.type.charAt(0) + addr.type.slice(1).toLowerCase()
    });
    setEditingId(addr.id);
    setMenuOpen(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setAddresses(a => a.filter(x => x.id !== id));
    setMenuOpen(null);
    if (editingId === id) { setEditingId(null); setForm(emptyForm); }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(() => {
      handleChange('city', 'Bengaluru');
      handleChange('state', 'Karnataka');
      handleChange('pincode', '560001');
    });
  };

  return (
    <div className="ma-page" onClick={() => setMenuOpen(null)}>
      <div className="ma-container">

        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          activeSubNav={activeSubNav}
          setActiveSubNav={setActiveSubNav}
        />

        <main className="ma-main">

          <div className="ma-header">
            <h1>Manage Addresses</h1>
            <p>Add or edit your shipping details for a faster checkout experience.</p>
          </div>

          {/* Add / Edit Address Form */}
          <div className="ma-form-section">
            <div className="ma-form-title-row">
              <span className="ma-form-title">{editingId ? 'EDIT ADDRESS' : 'ADD A NEW ADDRESS'}</span>
              <button className="ma-location-btn" onClick={handleLocation}>
                📍 Use my current location
              </button>
            </div>

            <div className="ma-form-grid">
              <div className="ma-field">
                <label>FULL NAME</label>
                <input type="text" placeholder="Enter recipient's name"
                  value={form.fullName}
                  onChange={e => handleChange('fullName', e.target.value.replace(/[^a-zA-Z\s]/g, ''))} />
                {errors.fullName && <span className="ma-error">{errors.fullName}</span>}
              </div>
              <div className="ma-field">
                <label>MOBILE NUMBER</label>
                <input type="tel" placeholder="10-digit mobile number"
                  value={form.mobile} maxLength={10}
                  onChange={e => handleChange('mobile', e.target.value.replace(/\D/g, ''))} />
                {errors.mobile && <span className="ma-error">{errors.mobile}</span>}
              </div>
              <div className="ma-field">
                <label>PINCODE</label>
                <input type="text" placeholder="6-digit pincode"
                  value={form.pincode} maxLength={6}
                  onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, ''))} />
                {errors.pincode && <span className="ma-error">{errors.pincode}</span>}
              </div>
              <div className="ma-field">
                <label>LOCALITY</label>
                <input type="text" placeholder="e.g. Bandra West"
                  value={form.locality}
                  onChange={e => handleChange('locality', e.target.value)} />
                {errors.locality && <span className="ma-error">{errors.locality}</span>}
              </div>
              <div className="ma-field ma-field-full">
                <label>ADDRESS (AREA AND STREET)</label>
                <textarea placeholder="Flat, House no., Building, Company, Apartment"
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)} rows={3} />
                {errors.address && <span className="ma-error">{errors.address}</span>}
              </div>
              <div className="ma-field">
                <label>CITY / DISTRICT / TOWN</label>
                <input type="text" placeholder="e.g. Mumbai"
                  value={form.city}
                  onChange={e => handleChange('city', e.target.value)} />
                {errors.city && <span className="ma-error">{errors.city}</span>}
              </div>
              <div className="ma-field">
                <label>STATE</label>
                <select value={form.state} onChange={e => handleChange('state', e.target.value)}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <span className="ma-error">{errors.state}</span>}
              </div>
              <div className="ma-field">
                <label>LANDMARK (OPTIONAL)</label>
                <input type="text" placeholder="e.g. Near Apollo Hospital"
                  value={form.landmark}
                  onChange={e => handleChange('landmark', e.target.value)} />
              </div>
              <div className="ma-field">
                <label>ALTERNATE PHONE (OPTIONAL)</label>
                <input type="tel" placeholder="Alternate mobile number"
                  value={form.altPhone} maxLength={10}
                  onChange={e => handleChange('altPhone', e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="ma-field ma-field-full">
                <label>ADDRESS TYPE</label>
                <div className="ma-radio-group">
                  <label className={`ma-radio ${form.type === 'Home' ? 'ma-radio-selected' : ''}`}>
                    <input type="radio" name="addrType" value="Home"
                      checked={form.type === 'Home'}
                      onChange={() => handleChange('type', 'Home')}
                      onClick={() => { if (form.type === 'Home') handleChange('type', ''); }} />
                    Home
                  </label>
                  <label className={`ma-radio ${form.type === 'Work' ? 'ma-radio-selected' : ''}`}>
                    <input type="radio" name="addrType" value="Work"
                      checked={form.type === 'Work'}
                      onChange={() => handleChange('type', 'Work')}
                      onClick={() => { if (form.type === 'Work') handleChange('type', ''); }} />
                    Work
                  </label>
                </div>
                {errors.type && <span className="ma-error">{errors.type}</span>}
              </div>
            </div>

            <div className="ma-form-actions">
              <button className="ma-btn-save" onClick={handleSave}>
                {saved ? 'SAVED!' : editingId ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
              </button>
              <button className="ma-btn-cancel" onClick={handleCancel}>CANCEL</button>
            </div>
          </div>

          {/* Saved Addresses */}
          {addresses.length > 0 && (
            <div className="ma-saved-section">
              <div className="ma-saved-header">
                <span className="ma-saved-title">SAVED ADDRESSES</span>
                <span className="ma-saved-count">{addresses.length} Address{addresses.length !== 1 ? 'es' : ''} found</span>
              </div>
              {addresses.map(addr => (
                <div key={addr.id} className="ma-address-card">
                  <div className="ma-address-top">
                    <span className="ma-addr-type">{addr.type}</span>
                    <div className="ma-menu-wrap" onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === addr.id ? null : addr.id); }}>
                      <button className="ma-addr-menu">⋮</button>
                      {menuOpen === addr.id && (
                        <div className="ma-dropdown">
                          <button onClick={() => handleEdit(addr)}>✏️ Edit</button>
                          <button className="ma-dropdown-delete" onClick={() => handleDelete(addr.id)}>🗑️ Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ma-addr-name">{addr.name} <span className="ma-addr-phone">{addr.phone}</span></div>
                  <div className="ma-addr-text">{addr.line1}<br />{addr.line2} <strong>{addr.pincode}</strong></div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}