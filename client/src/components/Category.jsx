import '../styles/Category.css';

const categories = [
  {
    label: 'Baby & Birthday Frocks',
    img: './images/baby-frocks.png',
    fallback: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop',
  },
  {
    label: 'Tops & T-Shirts',
    img: './images/tops-tshirts.png',
    fallback: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop',
  },
  {
    label: 'Indo-Western & Traditional Outfits',
    img: './images/indo-western.png',
    fallback: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop',
  },
  {
    label: 'Party Wear & Boys Collection',
    img: './images/party-wear.png',
    fallback: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=400&auto=format&fit=crop',
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
          <p className="category-sub">
            Discover stylish and comfortable kidswear for girls and boys at Sumathi Trends,<br />
            perfect for everyday wear and special occasions.
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