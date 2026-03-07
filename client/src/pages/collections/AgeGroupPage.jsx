import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgeGroupBanner from '../../components/collections/AgeGroupBanner';
import FilterSidebar from '../../components/collections/FilterSidebar';
import ProductGrid from '../../components/collections/ProductGrid';
import '../../styles/collections/AgeGroupPage.css';

const allProducts = {
  newborn: [
    { id: 1, name: 'Garden Breeze Dress',      price: '$84.00', oldPrice: null,     category: 'Dresses & Skirts', color: 'green',  age: '0-2Y', sustainability: true,  img: '/images/img1.webp',     badge: null, stars: 4.2, reviews: 42  },
    { id: 2, name: 'Coastline Striped Shirt',  price: '$56.00', oldPrice: '$72.00', category: 'Tops & Tees',      color: 'blue',   age: '0-2Y', sustainability: false, img: '/images/img2.webp',     badge: null, stars: 4.0, reviews: 38  },
    { id: 3, name: 'Earth Spirit Romper',      price: '$72.00', oldPrice: null,     category: 'Outerwear',        color: 'beige',  age: '0-2Y', sustainability: true,  img: '/images/img3.webp',     badge: null, stars: 4.6, reviews: 130 },
    { id: 4, name: 'Cloud Soft Knit Cardigan', price: '$110.00',oldPrice: null,     category: 'Knitwear',         color: 'cream',  age: '0-2Y', sustainability: false, img: '/images/img1.webp',     badge: null, stars: 4.1, reviews: 29  },
    { id: 5, name: 'Adventure Dungarees',      price: '$65.00', oldPrice: '$82.00', category: 'Outerwear',        color: 'beige',  age: '0-2Y', sustainability: true,  img: '/images/img2.webp',     badge: null, stars: 4.8, reviews: 304 },
    { id: 6, name: 'Heirloom Linen Blazer',    price: '$135.00',oldPrice: null,     category: 'Tops & Tees',      color: 'cream',  age: '0-2Y', sustainability: true,  img: '/images/img3.webp',     badge: null, stars: 4.3, reviews: 82  },
    { id: 7, name: 'Waffle Textured Plush Set',price: '$14.99', oldPrice: null,     category: 'Tops & Tees',      color: 'grey',   age: '0-2Y', sustainability: false, img: '/images/product1.png',  badge: null, stars: 4.5, reviews: 56  },
    { id: 8, name: 'Ribbed Jogging Set',       price: '$14.99', oldPrice: null,     category: 'Outerwear',        color: 'beige',  age: '0-2Y', sustainability: false, img: '/images/product2.png',  badge: null, stars: 4.2, reviews: 31  },
  ],
};

const AGE_META = {
  newborn: { label: "Newborn's", range: '0-2 Years', banner: './images/age-0-2.png' },
};

const PRODUCTS_PER_PAGE = 6;
const SORT_OPTIONS = ['Newest Arrivals', 'Price: Low to High', 'Price: High to Low', 'Best Rated'];

export default function AgeGroupPage() {
  const { ageGroup } = useParams();
  const navigate = useNavigate();

  // Scroll to very top on mount so banner is visible from the start
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [ageGroup]);

  const meta     = AGE_META[ageGroup]     || AGE_META.newborn;
  const products = allProducts[ageGroup] || allProducts.newborn;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors]         = useState([]);
  const [sustainableOnly, setSustainableOnly]       = useState(false);
  const [sortBy, setSortBy]                         = useState('Newest Arrivals');
  const [currentPage, setCurrentPage]               = useState(1);

  let filtered = [...products];
  if (selectedCategories.length > 0)
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  if (selectedColors.length > 0)
    filtered = filtered.filter(p => selectedColors.includes(p.color));
  if (sustainableOnly)
    filtered = filtered.filter(p => p.sustainability);

  if (sortBy === 'Price: Low to High')
    filtered.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
  if (sortBy === 'Price: High to Low')
    filtered.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
  if (sortBy === 'Best Rated')
    filtered.sort((a, b) => b.stars - a.stars);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginated  = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <main className="agp-page">
      <AgeGroupBanner meta={meta} />

      <div className="section-inner">
        <div className="agp-layout">
          <FilterSidebar
            products={products}
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
              setCurrentPage(1);
            }}
          />

          <div className="agp-right">
            <div className="agp-toolbar" style={{ justifyContent: 'flex-end' }}>
              <div className="agp-sort">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <ProductGrid products={paginated} />

            {totalPages > 1 && (
              <div className="agp-pagination">
                <button className="agp-page-btn agp-arrow" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} className={`agp-page-btn${currentPage === page ? ' active' : ''}`} onClick={() => handlePageChange(page)}>{page}</button>
                ))}
                <button className="agp-page-btn agp-arrow" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>→</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}