import { useEffect, useState, useRef } from 'react';
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

export default function ProductGrid({ 
  ageGroup, 
  propProducts, 
  onCountUpdate = () => {},
  onColorsUpdate = () => {},
  selectedCategories = [], 
  selectedSubcategories = [],
  selectedColors = [], 
  selectedAgeGroups = [],
  priceMin,
  priceMax,
  selectedRatings = [],
  sustainableOnly = false, 
  sortBy = 'Newest Arrivals' 
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [apiProducts, setApiProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;
  const gridTopRef = useRef(null);

  // ── Reset page when filters change ──
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories, 
    selectedSubcategories, 
    selectedColors, 
    selectedAgeGroups, 
    priceMin, 
    priceMax, 
    selectedRatings, 
    sortBy
  ]);

  useEffect(() => {
    if (propProducts) return;
    const fetchFromAPI = async () => {
      try {
        let url = '/api/products';
        const params = new URLSearchParams();
        
        if (ageGroup) {
          params.append('ageGroup', ageGroup);
        } else if (selectedAgeGroups.length > 0) {
          params.append('ageGroup', selectedAgeGroups.join(','));
        }
        
        const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;
        const res = await fetch(finalUrl);
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
  }, [ageGroup, selectedAgeGroups, propProducts]);

  let base;
  if (propProducts) {
    base = propProducts;
  } else if (apiProducts === null) {
    base = [];
  } else {
    base = apiProducts;
  }

  let filtered = [...base];

  // 1. Category & Subcategory Filter
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(p => {
      const pCats = Array.isArray(p.category) ? p.category : [p.category];
      const matchCat = pCats.some(c => selectedCategories.includes(c));
      
      if (selectedSubcategories.length > 0) {
        // Match either in the 'subCategory' (backend field) or 'category' array
        const pSubCats = Array.isArray(p.subCategory) ? p.subCategory : [p.subCategory];
        const matchSub = pSubCats.some(s => selectedSubcategories.includes(s)) || pCats.some(c => selectedSubcategories.includes(c));
        return matchCat && matchSub;
      }
      return matchCat;
    });
  }

  // 2. Color Filter
  if (selectedColors.length > 0) {
    const normalizedSelected = selectedColors.map(c => c.toLowerCase().trim());
    filtered = filtered.filter(p => 
      p.colors && Array.isArray(p.colors) && p.colors.some(c => 
        normalizedSelected.includes(c.name.toLowerCase().trim())
      )
    );
  }

  // 3. Price Filter
  if (priceMin !== undefined && priceMax !== undefined) {
    filtered = filtered.filter(p => p.price >= priceMin && p.price <= priceMax);
  }

  // 4. Ratings Filter
  if (selectedRatings.length > 0) {
    filtered = filtered.filter(p => {
      const floorRating = Math.floor(p.stars || 0);
      return selectedRatings.includes(floorRating);
    });
  }

  // 5. Sustainability Filter
  if (sustainableOnly) filtered = filtered.filter(p => p.sustainability);

  // 6. Sorting
  if (sortBy === 'Price: Low to High') filtered.sort((a, b) => parseFloat(String(a.price).replace(/[^\d.]/g, '')) - parseFloat(String(b.price).replace(/[^\d.]/g, '')));
  if (sortBy === 'Price: High to Low') filtered.sort((a, b) => parseFloat(String(b.price).replace(/[^\d.]/g, '')) - parseFloat(String(a.price).replace(/[^\d.]/g, '')));
  if (sortBy === 'Best Rated') filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));


  useEffect(() => {
    if (!base || base.length === 0) return;
    const colorsMap = new Map();
    base.forEach(p => {
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach(c => {
          if (c.name && c.hex) {
            const normalizedName = c.name.toLowerCase().trim();
            // We keep the first occurrence's display name and hex
            if (!colorsMap.has(normalizedName)) {
              colorsMap.set(normalizedName, { displayName: c.name.trim(), hex: c.hex });
            }
          }
        });
      }
    });
    const uniqueColors = Array.from(colorsMap.values()).map(c => ({ name: c.displayName, hex: c.hex }));
    onColorsUpdate(uniqueColors);
  }, [base, onColorsUpdate]);

  useEffect(() => {
    onCountUpdate(filtered.length);
  }, [filtered.length, onCountUpdate]);

  if (apiProducts === null && !propProducts) {
    return <div className="pg-loading"><p>Loading products...</p></div>;
  }

  if (!filtered.length) {
    return <div className="pg-empty"><p>No products found.</p></div>;
  }

  // ── Pagination Calculation ──
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (gridTopRef.current) {
        const navHeight = document.querySelector('nav')?.getBoundingClientRect().height || 80;
        const top = gridTopRef.current.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') return `₹${price}`;
    return price;
  };

  const getBadgeClass = (badge) => {
    if (badge === 'Bestselling') return 'pg-badge pg-badge-best';
    if (badge === 'Sale') return 'pg-badge pg-badge-sale';
    if (badge === 'New') return 'pg-badge pg-badge-new';
    return 'pg-badge';
  };

  return (
    <div className="pg-container" ref={gridTopRef}>
      <div className="pg-grid">
        {paginatedItems.map((product) => (
          <Link
            key={product._id || product.id}
            to={`/collections/${product.ageGroup || toAgeGroup(product.age)}/${toSlug(product.name)}`}
            className="pg-card"
          >
            <div className={`pg-img-wrap ${product.stock <= 0 ? 'pg-out-of-stock' : ''}`}>
              <img src={product.img} alt={product.name} />
              {product.stock <= 0 && (
                <div className="pg-out-overlay">
                  <span>currently not available</span>
                </div>
              )}
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
              <span className="pg-category">{(Array.isArray(product.category) ? product.category : [product.category])[0]}</span>
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

      {totalPages > 1 && (
        <div className="pg-pagination">
          <button 
            className="pg-pag-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="pg-pag-info">{currentPage} / {totalPages}</span>
          <button 
            className="pg-pag-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
