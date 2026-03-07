import { Link } from 'react-router-dom';
import '../../styles/collections/ProductGrid.css';

const Stars = ({ rating, reviews }) => (
  <div className="pg-stars">
    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    <span className="pg-reviews">({reviews})</span>
  </div>
);

// Convert "Garden Breeze Dress" → "garden-breeze-dress"
const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Convert age "0-2Y" → "newborn", "3-6Y" → "toddler", "7-12Y" → "junior"
const toAgeGroup = (age) => {
  if (age === '0-2Y') return 'newborn';
  if (age === '3-6Y') return 'toddler';
  return 'junior';
};

export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <div className="pg-empty">
        <p>No products match your filters.</p>
      </div>
    );
  }

  return (
    <div className="pg-grid">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/collections/${toAgeGroup(product.age)}/${toSlug(product.name)}`}
          className="pg-card"
        >
          {/* Image */}
          <div className="pg-img-wrap">
            <img src={product.img} alt={product.name} />
            {product.badge && (
              <span className="pg-badge">{product.badge}</span>
            )}
            {product.oldPrice && (
              <span className="pg-sale-badge">Sale</span>
            )}
            <button
              className="pg-wishlist"
              aria-label="Wishlist"
              onClick={(e) => e.preventDefault()}
            >
              ♡
            </button>
          </div>

          {/* Info */}
          <div className="pg-info">
            <span className="pg-category">{product.category}</span>
            <div className="pg-name">{product.name}</div>
            <Stars rating={product.stars} reviews={product.reviews} />
            <div className="pg-price-row">
              <span className="pg-price">{product.price}</span>
              {product.oldPrice && (
                <span className="pg-old-price">{product.oldPrice}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}