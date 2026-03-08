import { useState } from 'react';
import '../../styles/collections/FilterSidebar.css';

const SIZES = ['0-2Y', '3-5Y', '6-12Y'];

const COLORS = [
  { name: 'blue',      hex: '#4A90D9' },
  { name: 'red',       hex: '#E05A4E' },
  { name: 'gray',      hex: '#9B9B9B' },
  { name: 'orange',    hex: '#E8943A' },
  { name: 'navy',      hex: '#4A5568' },
  { name: 'brown',     hex: '#C17B5C' },
  { name: 'black',     hex: '#1A1A1A' },
  { name: 'darkgreen', hex: '#2D5A3D' },
  { name: 'charcoal',  hex: '#4A4A4A' },
];

const GENDERS = ['Men', 'Women', 'Unisex', 'Kid'];
const RATINGS = [5, 4, 3, 2, 1];
const CATEGORIES = [
  'Baby Frocks', 'Birthday Frocks', 'Tops & T-Shirts',
  'Indo-Western Outfits', 'Traditional Outfits', 'Party Wear', 'Boys Collection',
];

function Stars({ count }) {
  return (
    <span className="fs-stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i <= count ? '#F59E0B' : '#E5E7EB'}
          stroke={i <= count ? '#F59E0B' : '#D1D5DB'}
          strokeWidth="1">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

function Chevron({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {open ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
    </svg>
  );
}

export default function FilterSidebar({
  selectedCategories = [], setSelectedCategories = () => {},
  selectedColors = [],     setSelectedColors = () => {},
  onReset = () => {},
}) {
  const [selectedSizes,   setSelectedSizes]   = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceMin, setPriceMin] = useState(500);
  const [priceMax, setPriceMax] = useState(3000);
  const [open, setOpen] = useState({
    size: true, color: true, gender: true, price: true, ratings: true, category: false,
  });

  const toggleSection = (k) => setOpen(p => ({ ...p, [k]: !p[k] }));
  const toggleItem = (val, arr, setArr) =>
    setArr(p => p.includes(val) ? p.filter(v => v !== val) : [...p, val]);

  const handleReset = () => {
    setSelectedSizes([]); setSelectedColors([]); setSelectedGenders([]);
    setSelectedRatings([]); setPriceMin(500); setPriceMax(3000);
    setSelectedCategories([]); onReset();
  };

  const MIN = 500, MAX = 3000;
  const minPct = ((priceMin - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((priceMax - MIN) / (MAX - MIN)) * 100;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <div className="filter-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filter
        </div>
        <button className="filter-reset" onClick={handleReset}>Reset</button>
      </div>

      {/* Size */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('size')}>
          <span>Size</span><Chevron open={open.size} />
        </div>
        {open.size && (
          <div className="fs-size-grid">
            {SIZES.map(s => (
              <button key={s}
                className={"fs-size-chip" + (selectedSizes.includes(s) ? ' active' : '')}
                onClick={() => toggleItem(s, selectedSizes, setSelectedSizes)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      {/* Color */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('color')}>
          <span>Color</span><Chevron open={open.color} />
        </div>
        {open.color && (
          <div className="filter-colors">
            {COLORS.map(c => (
              <button key={c.name}
                className={"color-dot" + (selectedColors.includes(c.name) ? ' active' : '')}
                style={{ backgroundColor: c.hex }}
                onClick={() => toggleItem(c.name, selectedColors, setSelectedColors)}
                title={c.name} />
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('gender')}>
          <span>Gender</span><Chevron open={open.gender} />
        </div>
        {open.gender && (
          <div className="fs-gender-grid">
            {GENDERS.map(g => (
              <label key={g} className="filter-checkbox-label">
                <input type="checkbox" checked={selectedGenders.includes(g)}
                  onChange={() => toggleItem(g, selectedGenders, setSelectedGenders)}
                  className="filter-checkbox" />
                <span className={"filter-label-text" + (selectedGenders.includes(g) ? ' active' : '')}>{g}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('price')}>
          <span>Price</span><Chevron open={open.price} />
        </div>
        {open.price && (
          <div className="fs-price">
            <div className="fs-range-wrap">
              <div className="fs-range-track-bg" />
              <div className="fs-range-fill" style={{ left: minPct + '%', width: (maxPct - minPct) + '%' }} />
              <input type="range" min={MIN} max={MAX} value={priceMin}
                onChange={e => setPriceMin(Math.min(Number(e.target.value), priceMax - 100))}
                className="fs-range fs-range-min" />
              <input type="range" min={MIN} max={MAX} value={priceMax}
                onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 100))}
                className="fs-range fs-range-max" />
            </div>
            <div className="fs-price-labels">
              <span>₹{priceMin.toLocaleString()}</span>
              <span>₹{priceMax.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('ratings')}>
          <span>Customer Ratings</span><Chevron open={open.ratings} />
        </div>
        {open.ratings && (
          <div className="fs-ratings-grid">
            {RATINGS.map(r => (
              <label key={r} className="filter-checkbox-label">
                <input type="checkbox" checked={selectedRatings.includes(r)}
                  onChange={() => toggleItem(r, selectedRatings, setSelectedRatings)}
                  className="filter-checkbox" />
                <Stars count={r} />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection('category')}>
          <span>Category</span><Chevron open={open.category} />
        </div>
        {open.category && (
          <ul className="filter-list">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <label className="filter-checkbox-label">
                  <input type="checkbox" checked={selectedCategories.includes(cat)}
                    onChange={() => toggleItem(cat, selectedCategories, setSelectedCategories)}
                    className="filter-checkbox" />
                  <span className={"filter-label-text" + (selectedCategories.includes(cat) ? ' active' : '')}>{cat}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}