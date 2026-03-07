import '../styles/Category.css';

// 4 categories — exactly as in the original HTML
const categories = [
  {
    label: 'Tops',
    img: './images/tops.png',
    fallback: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop',
  },
  {
    label: 'Bottoms',
    img: './images/bottoms.png',
    fallback: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=400&auto=format&fit=crop',
  },
  {
    label: 'Dresses',
    img: './images/dresses.png',
    fallback: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop',
  },
  {
    label: 'Accessories',
    img: './images/accessories.png',
    fallback: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
  },
];

export default function Category() {
  return (
    <section id="collections" className="category-section">
      <div className="section-inner">

        {/* Title: "<span>Shop By</span> Category" — span is charcoal, "Category" is clay */}
        <div className="category-header">
          <h2 className="category-title">
            <span>Shop By</span> Category
          </h2>
          <p className="category-sub">
            Discover Our Wide Range Of Products Carefully Organized.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <a key={cat.label} href="#" className="category-card">
              <div className="category-circle">
                <img
                  src={cat.img}
                  alt={cat.label}
                  onError={(e) => { e.target.src = cat.fallback; }}
                />
              </div>
              <span className="category-label">{cat.label}</span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}