import { useState } from 'react';
import '../../styles/collectiondetails/ProductAccordion.css';

const SPECS = [
  { label: 'Brand',         value: 'Sumathi Trends' },
  { label: 'Style Code',    value: 'GBD-S-GR' },
  { label: 'Brand Color',   value: 'Green' },
  { label: 'Size',          value: '2-3Y to 8-9Y' },
  { label: 'Type',          value: 'Fit and Flare Dress' },
  { label: 'Occasion',      value: 'Casual / Festive' },
  { label: 'Ideal For',     value: 'Girls' },
  { label: 'Primary Color', value: 'Green' },
  { label: 'Fabric',        value: 'Organic Cotton' },
  { label: 'Sleeve Type',   value: 'Flutter Sleeve' },
  { label: 'Suitable For',  value: 'Western Wear' },
  { label: 'Net Quantity',  value: '1 Dress' },
];

const ALL_DETAILS_TABS = ['Specifications', 'Description', 'Manufacturer info'];

const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export default function ProductAccordion() {
  const [openSection, setOpenSection] = useState(null);
  const [detailTab, setDetailTab]     = useState('Specifications');
  const [question, setQuestion]       = useState('');

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div className="pa-wrapper">

      {/* All details */}
      <div className={`pa-item${openSection === 'details' ? ' open' : ''}`}>
        <button className="pa-header" onClick={() => toggle('details')}>
          <span>All details</span>
          <span className="pa-chevron">
            {openSection === 'details' ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>

        {openSection === 'details' && (
          <div className="pa-body">
            <div className="pa-tabs">
              {ALL_DETAILS_TABS.map(t => (
                <button
                  key={t}
                  className={`pa-tab${detailTab === t ? ' active' : ''}`}
                  onClick={() => setDetailTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {detailTab === 'Specifications' && (
              <div className="pa-spec-section">
                <p className="pa-spec-group-label">General</p>
                <div className="pa-spec-grid">
                  {SPECS.map(s => (
                    <div key={s.label} className="pa-spec-cell">
                      <p className="pa-spec-label">{s.label}</p>
                      <p className="pa-spec-value">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailTab === 'Description' && (
              <p className="pa-desc-text">
                The fabric is premium quality organic cotton — soft, breathable, and GOTS certified.
                Sumathi Trends is a premier children's wear brand. We manufacture best quality
                products for kids, providing styling without compromising comfort or durability.
                This lovely Garden Breeze Dress is perfect for your little girl's every adventure.
              </p>
            )}

            {detailTab === 'Manufacturer info' && (
              <div className="pa-mfr-grid">
                <div className="pa-spec-cell">
                  <p className="pa-spec-label">Generic Name</p>
                  <p className="pa-spec-value">Kids Dress</p>
                </div>
                <div className="pa-spec-cell">
                  <p className="pa-spec-label">Country of Origin</p>
                  <p className="pa-spec-value">India</p>
                </div>
                <div className="pa-spec-cell full">
                  <p className="pa-spec-label">Name and address of the Manufacturer</p>
                  <p className="pa-spec-value">SUMATHI TRENDS</p>
                </div>
                <div className="pa-spec-cell full">
                  <p className="pa-spec-label">Name and address of the Packer</p>
                  <p className="pa-spec-value">SUMATHI TRENDS</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product highlights */}
      <div className={`pa-item${openSection === 'highlights' ? ' open' : ''}`}>
        <button className="pa-header" onClick={() => toggle('highlights')}>
          <span>Product highlights</span>
          <span className="pa-chevron">
            {openSection === 'highlights' ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>
        {openSection === 'highlights' && (
          <div className="pa-body">
            <div className="pa-highlights-grid">
              {[
                { label: 'SLEEVE TYPE', value: 'Flutter Sleeve' },
                { label: 'MATERIAL',    value: 'Pure Organic Cotton' },
                { label: 'NECK TYPE',   value: 'Round Neck' },
                { label: 'PATTERN',     value: 'Floral Print' },
              ].map(r => (
                <div key={r.label} className="pa-highlight-cell">
                  <p className="pa-hl-label">{r.label}</p>
                  <p className="pa-hl-value">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Q&A */}
      <div className={`pa-item${openSection === 'qa' ? ' open' : ''}`}>
        <button className="pa-header" onClick={() => toggle('qa')}>
          <span>Questions and Answers</span>
          <span className="pa-chevron">
            {openSection === 'qa' ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>
        {openSection === 'qa' && (
          <div className="pa-body">
            <p className="pa-qa-empty">Be the first to ask about this product</p>
            <div className="pa-qa-field">
              <input
                className="pa-qa-input"
                type="text"
                placeholder="Ask a question"
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
              <button className="pa-qa-send" onClick={() => setQuestion('')}>Send</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}