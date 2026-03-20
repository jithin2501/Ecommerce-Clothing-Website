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

// Static fallback products (used when API returns nothing)
const STATIC_PRODUCTS = {
  newborn: [
    { id: 1,  name: 'Garden Breeze Dress',       price: '₹849',   oldPrice: null,    category: 'Baby Frocks',    color: 'green',  age: '0-2Y', sustainability: true,  img: '/images/img1.webp',    badge: null,          stars: 4.2, reviews: 42  },
    { id: 2,  name: 'Coastline Striped Shirt',   price: '₹649',   oldPrice: '₹849',  category: 'Tops & T-Shirts',color: 'blue',   age: '0-2Y', sustainability: false, img: '/images/img2.webp',    badge: null,          stars: 4.0, reviews: 38  },
    { id: 3,  name: 'Earth Spirit Romper',        price: '₹799',   oldPrice: null,    category: 'Boys Collection',color: 'beige',  age: '0-2Y', sustainability: true,  img: '/images/img3.webp',    badge: 'New',         stars: 4.6, reviews: 130 },
    { id: 4,  name: 'Cloud Soft Knit Cardigan',  price: '₹1199',  oldPrice: null,    category: 'Party Wear',     color: 'cream',  age: '0-2Y', sustainability: false, img: '/images/img1.webp',    badge: null,          stars: 4.1, reviews: 29  },
    { id: 5,  name: 'Adventure Dungarees',        price: '₹749',   oldPrice: '₹949', category: 'Boys Collection',color: 'beige',  age: '0-2Y', sustainability: true,  img: '/images/img2.webp',    badge: 'Bestselling', stars: 4.8, reviews: 304 },
    { id: 6,  name: 'Heirloom Linen Blazer',     price: '₹1499',  oldPrice: null,    category: 'Party Wear',     color: 'cream',  age: '0-2Y', sustainability: true,  img: '/images/img3.webp',    badge: null,          stars: 4.3, reviews: 82  },
    { id: 7,  name: 'Waffle Textured Plush Set', price: '₹549',   oldPrice: null,    category: 'Tops & T-Shirts',color: 'grey',   age: '0-2Y', sustainability: false, img: '/images/product1.png', badge: null,          stars: 4.5, reviews: 56  },
    { id: 8,  name: 'Ribbed Jogging Set',         price: '₹599',   oldPrice: null,    category: 'Boys Collection',color: 'beige',  age: '0-2Y', sustainability: false, img: '/images/product2.png', badge: null,          stars: 4.2, reviews: 31  },
  ],
};

export default function ProductGrid({ ageGroup, products: propProducts, selectedCategories = [], selectedColors = [], sustainableOnly = false, sortBy = 'Newest Arrivals' }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [apiProducts, setApiProducts] = useState(null); // null = not yet fetched

  useEffect(() => {
    if (propProducts) return; // parent passed products directly — skip fetch
    const fetchFromAPI = async () => {
      try {
        const url  = ageGroup ? `http://localhost:5000/api/products?ageGroup=${ageGroup}` : 'http://localhost:5000/api/products';
        const res  = await fetch(url);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setApiProducts(data.data);
        } else {
          setApiProducts([]); // use fallback
        }
      } catch {
        setApiProducts([]); // use fallback on error
      }
    };
    fetchFromAPI();
  }, [ageGroup, propProducts]);

  // Decide which source to use
  let base;
  if (propProducts) {
    base = propProducts;
  } else if (apiProducts === null) {
    base = []; // loading
  } else if (apiProducts.length > 0) {
    base = apiProducts;
  } else {
    // fallback to static
    base = ageGroup ? (STATIC_PRODUCTS[ageGroup] || []) : Object.values(STATIC_PRODUCTS).flat();
  }

  // Apply filters
  let filtered = [...base];
  if (selectedCategories.length > 0) filtered = filtered.filter(p => selectedCategories.includes(p.category));
  if (selectedColors.length > 0)     filtered = filtered.filter(p => selectedColors.includes(p.color));
  if (sustainableOnly)               filtered = filtered.filter(p => p.sustainability);

  // Apply sort
  if (sortBy === 'Price: Low to High') filtered.sort((a, b) => parseFloat(String(a.price).replace(/[^\d.]/g,'')) - parseFloat(String(b.price).replace(/[^\d.]/g,'')));
  if (sortBy === 'Price: High to Low') filtered.sort((a, b) => parseFloat(String(b.price).replace(/[^\d.]/g,'')) - parseFloat(String(a.price).replace(/[^\d.]/g,'')));
  if (sortBy === 'Best Rated')         filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));

  if (apiProducts === null && !propProducts) {
    return <div className="pg-loading"><p>Loading products...</p></div>;
  }

  if (!filtered.length) {
    return <div className="pg-empty"><p>No products match your filters.</p></div>;
  }

  const formatPrice = (price) => {
    if (typeof price === 'number') return `₹${price}`;
    return price;
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
            {product.badge && <span className={`pg-badge ${product.badge === 'Bestselling' ? 'pg-badge-best' : ''}`}>{product.badge}</span>}
            {product.oldPrice && <span className="pg-sale-badge">Sale</span>}
            {product.age && <span className="pg-age-badge">Ages {product.age}</span>}
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