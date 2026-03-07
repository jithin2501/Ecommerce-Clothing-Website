import '../../styles/collections/FilterSidebar.css';

const CATEGORIES = ['Dresses & Skirts', 'Tops & Tees', 'Outerwear', 'Knitwear'];
const COLORS = [
  { name: 'blue',  hex: '#7EB8D4' },
  { name: 'green', hex: '#8DB89A' },
  { name: 'beige', hex: '#C8B89A' },
  { name: 'pink',  hex: '#E8A4A4' },
  { name: 'cream', hex: '#E8DCC8' },
];

export default function FilterSidebar({
  selectedCategories, setSelectedCategories,
  selectedColors, setSelectedColors,
  onReset,
}) {
  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  return (
    <aside className="filter-sidebar">

      {/* Header */}
      <div className="filter-header">
        <div className="filter-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filters
        </div>
        <button className="filter-reset" onClick={onReset}>Reset</button>
      </div>

      <p className="filter-section-label">REFINE SELECTION</p>

      {/* Age (static display) */}
      <div className="filter-group">
        <div className="filter-group-header">
          <span>AGE</span>
          <span className="filter-chevron">▾</span>
        </div>
        <div className="filter-age-chips">
          <span className="age-chip active">0-2Y</span>
          <span className="age-chip">3-5Y</span>
          <span className="age-chip">6-12Y</span>
        </div>
      </div>

      {/* Category */}
      <div className="filter-group">
        <div className="filter-group-header">
          <span>CATEGORY</span>
          <span className="filter-chevron">▾</span>
        </div>
        <ul className="filter-list">
          {CATEGORIES.map(cat => (
            <li key={cat} className="filter-item">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="filter-checkbox"
                />
                <span className={`filter-label-text${selectedCategories.includes(cat) ? ' active' : ''}`}>
                  {cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Color */}
      <div className="filter-group">
        <div className="filter-group-header">
          <span>COLOR</span>
          <span className="filter-chevron">▾</span>
        </div>
        <div className="filter-colors">
          {COLORS.map(c => (
            <button
              key={c.name}
              className={`color-dot${selectedColors.includes(c.name) ? ' active' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => toggleColor(c.name)}
              title={c.name}
            />
          ))}
        </div>
      </div>

    </aside>
  );
}