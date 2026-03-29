import '../../styles/homepage/Category.css';

const categories = [
  {
    label: 'OCCASION & DAILY\nWEAR FROCKS',
    img: '/images/categories/occasion & daily wear frocks.png',
  },
  {
    label: 'PARTY WEAR\nCOLLECTION',
    img: '/images/categories/occasion & daily wear frocks.png',
  },
  {
    label: 'DESIGNER & PREMIUM\nFROCKS',
    img: '/images/categories/occasion & daily wear frocks.png',
  },
  {
    label: 'TRADITIONAL & ETHNIC\nFROCKS',
    img: '/images/categories/occasion & daily wear frocks.png',
  },
];

export default function Category() {
  return (
    <section id="collections" className="category-section">
      <div className="section-inner">

        <div className="category-header">
          <h2 className="category-title">
            <span>Shop By</span> Category
          </h2>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.label} className="category-card">
              <div className="category-circle">
                <img src={cat.img} alt={cat.label} />
              </div>

              <span className="category-label">
                {cat.label.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>
                    {line}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}