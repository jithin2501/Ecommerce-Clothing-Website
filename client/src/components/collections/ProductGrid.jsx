import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import '../../styles/collections/ProductGrid.css';

const Stars = ({ rating, reviews }) => (
  <div className="pg-stars">
    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    <span className="pg-reviews">({reviews})</span>
  </div>
);

const toSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const toAgeGroup = (age) => {
  if (age === '0-2Y') return 'newborn';
  if (age === '3-6Y') return 'toddler';
  return 'junior';
};

export default function ProductGrid({ products }) {
  const { toggleWishlist, isWishlisted } = useWishlist();

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
          <div className="pg-img-wrap">
            <img src={product.img} alt={product.name} />
            {product.badge && <span className="pg-badge">{product.badge}</span>}
            {product.oldPrice && <span className="pg-sale-badge">Sale</span>}
            <button
              className={`pg-wishlist ${isWishlisted(product.id) ? 'pg-wishlist--active' : ''}`}
              aria-label="Wishlist"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product);
              }}
            >
              {isWishlisted(product.id) ? '♥' : '♡'}
            </button>
          </div>

          <div className="pg-info">
            <span className="pg-category">{product.category}</span>
            <div className="pg-name">{product.name}</div>
            <Stars rating={product.stars} reviews={product.reviews} />
            <div className="pg-price-row">
              <span className="pg-price">{product.price}</span>
              {product.oldPrice && <span className="pg-old-price">{product.oldPrice}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}