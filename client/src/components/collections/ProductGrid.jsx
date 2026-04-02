import { useEffect, useState } from 'react';
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

export default function ProductGrid({ ageGroup, products: propProducts, selectedCategories = [], selectedColors = [], sustainableOnly = false, sortBy = 'Newest Arrivals' }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [apiProducts, setApiProducts] = useState(null);

  useEffect(() => {
    if (propProducts) return;
    const fetchFromAPI = async () => {
      try {
        const url  = ageGroup ? `http://localhost:5000/api/products?ageGroup=${ageGroup}` : 'http://localhost:5000/api/products';
        const res  = await fetch(url);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setApiProducts(data.data);
        } else {
          setApiProducts([]);
        }
      } catch {
        setApiProducts([]);
      }
    };
    fetchFromAPI();
  }, [ageGroup, propProducts]);

  let base;
  if (propProducts) {
    base = propProducts;
  } else if (apiProducts === null) {
    base = [];
  } else {
    base = apiProducts;
  }

  let filtered = [...base];
  if (selectedCategories.length > 0) filtered = filtered.filter(p => selectedCategories.includes(p.category));
  if (selectedColors.length > 0)     filtered = filtered.filter(p => selectedColors.includes(p.color));
  if (sustainableOnly)               filtered = filtered.filter(p => p.sustainability);

  if (sortBy === 'Price: Low to High') filtered.sort((a, b) => parseFloat(String(a.price).replace(/[^\d.]/g,'')) - parseFloat(String(b.price).replace(/[^\d.]/g,'')));
  if (sortBy === 'Price: High to Low') filtered.sort((a, b) => parseFloat(String(b.price).replace(/[^\d.]/g,'')) - parseFloat(String(a.price).replace(/[^\d.]/g,'')));
  if (sortBy === 'Best Rated')         filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));

  if (apiProducts === null && !propProducts) {
    return <div className="pg-loading"><p>Loading products...</p></div>;
  }

  if (!filtered.length) {
    return <div className="pg-empty"><p>No products found.</p></div>;
  }

  const formatPrice = (price) => {
    if (typeof price === 'number') return `₹${price}`;
    return price;
  };

  const getBadgeClass = (badge) => {
    if (badge === 'Bestselling') return 'pg-badge pg-badge-best';
    if (badge === 'Sale')        return 'pg-badge pg-badge-sale';
    if (badge === 'New')         return 'pg-badge pg-badge-new';
    return 'pg-badge';
  };

  return (
    <div className="pg-grid">
      {filtered.map((product) => (
        <Link
          key={product._id || product.id}
          to={`/collections/${product.ageGroup || toAgeGroup(product.age)}/${toSlug(product.name)}`}
          className="pg-card"
        >
          <div className="pg-img-wrap">
            <img src={product.img} alt={product.name} />
            {product.badge && (
              <span className={getBadgeClass(product.badge)}>{product.badge}</span>
            )}
            {product.age && <span className="pg-age-badge">AGE {product.age.replace(/Months?/ig, 'M').replace(/Years?/ig, 'Y')}</span>}
            <button
              className={`pg-wishlist ${isWishlisted(product._id || product.id) ? 'pg-wishlist--active' : ''}`}
              aria-label="Wishlist"
              onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            >
              {isWishlisted(product._id || product.id) ? '♥' : '♡'}
            </button>
          </div>
          <div className="pg-info">
            <span className="pg-category">{product.category}</span>
            <div className="pg-name">{product.name}</div>
            <Stars rating={product.stars || 0} reviews={product.reviews || 0} />
            <div className="pg-price-row">
              <span className="pg-price">{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="pg-old-price">{formatPrice(product.oldPrice)}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}