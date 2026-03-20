import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AgeGroupBanner from '../../components/collections/AgeGroupBanner';
import FilterSidebar from '../../components/collections/FilterSidebar';
import ProductGrid from '../../components/collections/ProductGrid';
import '../../styles/collections/AgeGroupPage.css';

const AGE_META = {
  newborn: { label: "Newborn's", range: '0-2 Years' },
  toddler: { label: "Toddler's", range: '3-6 Years' },
  junior:  { label: "Junior's",  range: '7-12 Years' },
};

const SORT_OPTIONS = ['Newest Arrivals', 'Price: Low to High', 'Price: High to Low', 'Best Rated'];

export default function AgeGroupPage() {
  const { ageGroup } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [ageGroup]);

  const meta = AGE_META[ageGroup] || AGE_META.newborn;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors,     setSelectedColors]     = useState([]);
  const [sustainableOnly,    setSustainableOnly]    = useState(false);
  const [sortBy,             setSortBy]             = useState('Newest Arrivals');

  return (
    <main className="agp-page">
      <AgeGroupBanner meta={meta} />
      <div className="nav-spacer" />

      <div className="section-inner">
        <div className="page-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep"> › </span>
          <Link to="/collections" className="breadcrumb-link">Collections</Link>
          <span className="breadcrumb-sep"> › </span>
          <span className="breadcrumb-current">{meta.label}</span>
        </div>

        <div className="agp-layout">
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            sustainableOnly={sustainableOnly}
            setSustainableOnly={setSustainableOnly}
            onReset={() => {
              setSelectedCategories([]);
              setSelectedColors([]);
              setSustainableOnly(false);
            }}
          />
          <div className="agp-right">
            <div className="agp-toolbar" style={{ justifyContent: 'flex-end' }}>
              <div className="agp-sort">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <ProductGrid
              ageGroup={ageGroup}
              selectedCategories={selectedCategories}
              selectedColors={selectedColors}
              sustainableOnly={sustainableOnly}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
    </main>
  );
}