import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FilterSidebar from '../../components/collections/FilterSidebar';
import ProductGrid from '../../components/collections/ProductGrid';
import '../../styles/collections/CollectionsPage.css';

const SORT_OPTIONS = ['Newest Arrivals', 'Price: Low to High', 'Price: High to Low', 'Best Rated'];
const MIN_PRICE = 500;
const MAX_PRICE = 3000;

export default function CollectionsPage() {
  const location = useLocation();
  const { category, subcategory, ageGroup } = location.state || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ── Filter states ──
  const [selectedCategories, setSelectedCategories] = useState(subcategory ? [subcategory] : []);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState(ageGroup ? [ageGroup] : []);
  const [priceMin, setPriceMin] = useState(MIN_PRICE);
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState('Newest Arrivals');
  const [productCount, setProductCount] = useState(0);

  // ── Sidebar section toggle state ──
  const [open, setOpen] = useState({
    color: true, price: true, ratings: true, category: true, age: true
  });

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedAgeGroups([]);
    setPriceMin(MIN_PRICE);
    setPriceMax(MAX_PRICE);
    setSelectedRatings([]);
  };

  return (
    <main className="collections-page">
      <div className="section-inner">
        {/* Breadcrumb - reduced gap */}
        <div className="page-breadcrumb" style={{ marginTop: '20px' }}>
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep"> › </span>
          <span className="breadcrumb-current">Collections</span>
          {category && (
            <>
              <span className="breadcrumb-sep"> › </span>
              <span className="breadcrumb-current">{category}</span>
            </>
          )}
          {subcategory && (
            <>
              <span className="breadcrumb-sep"> › </span>
              <span className="breadcrumb-current">{subcategory}</span>
            </>
          )}
        </div>

        <div className="agp-layout" style={{ marginTop: '10px', marginBottom: '60px' }}>
          <FilterSidebar
            selectedColors={selectedColors} setSelectedColors={setSelectedColors}
            selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
            selectedAgeGroups={selectedAgeGroups} setSelectedAgeGroups={setSelectedAgeGroups}
            priceMin={priceMin} setPriceMin={setPriceMin}
            priceMax={priceMax} setPriceMax={setPriceMax}
            selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings}
            open={open} setOpen={setOpen}
            onReset={handleReset}
          />

          <div className="agp-right">
            <div className="agp-toolbar">
              <h2 className="agp-gallery-title" style={{ margin: 0, fontWeight: '700', color: '#1A1A1A' }}>
                All Products <span style={{ color: '#9CA3AF', fontWeight: '400' }}>({productCount})</span>
              </h2>
              <div className="agp-sort">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <ProductGrid
              selectedCategories={selectedCategories}
              selectedColors={selectedColors}
              selectedAgeGroups={selectedAgeGroups}
              priceMin={priceMin}
              priceMax={priceMax}
              selectedRatings={selectedRatings}
              sortBy={sortBy}
              onCountUpdate={setProductCount}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
