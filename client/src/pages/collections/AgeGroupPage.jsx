import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgeGroupBanner from '../../components/collections/AgeGroupBanner';
import FilterSidebar from '../../components/collections/FilterSidebar';
import ProductGrid from '../../components/collections/ProductGrid';
import '../../styles/collections/AgeGroupPage.css';

// All products per age group
const allProducts = {
  newborn: [
    { id: 1, name: 'Garden Breeze Dress',      price: '$84.00', oldPrice: null,     category: 'Dresses & Skirts', color: 'green',  age: '0-2Y',  sustainability: true,  img: '/images/img1.webp', badge: null,        stars: 4.2, reviews: 42  },
    { id: 2, name: 'Coastline Striped Shirt',  price: '$56.00', oldPrice: '$72.00', category: 'Tops & Tees',      color: 'blue',   age: '0-2Y',  sustainability: false, img: '/images/img2.webp', badge: null,        stars: 4.0, reviews: 38  },
    { id: 3, name: 'Earth Spirit Romper',      price: '$72.00', oldPrice: null,     category: 'Outerwear',        color: 'beige',  age: '0-2Y',  sustainability: true,  img: '/images/img3.webp', badge: null,        stars: 4.6, reviews: 130 },
    { id: 4, name: 'Cloud Soft Knit Cardigan', price: '$110.00',oldPrice: null,     category: 'Knitwear',         color: 'cream',  age: '0-2Y',  sustainability: false, img: '/images/img1.webp', badge: null,        stars: 4.1, reviews: 29  },
    { id: 5, name: 'Adventure Dungarees',      price: '$65.00', oldPrice: '$82.00', category: 'Outerwear',        color: 'beige',  age: '0-2Y',  sustainability: true,  img: '/images/img2.webp', badge: 'Best Seller',stars: 4.8, reviews: 304 },
    { id: 6, name: 'Heirloom Linen Blazer',    price: '$135.00',oldPrice: null,     category: 'Tops & Tees',      color: 'cream',  age: '0-2Y',  sustainability: true,  img: '/images/img3.webp', badge: null,        stars: 4.3, reviews: 82  },
    { id: 7, name: 'Waffle Textured Plush Set',price: '$14.99', oldPrice: null,     category: 'Tops & Tees',      color: 'grey',   age: '0-2Y',  sustainability: false, img: '/images/product1.png',badge: null,        stars: 4.5, reviews: 56  },
    { id: 8, name: 'Ribbed Jogging Set',       price: '$14.99', oldPrice: null,     category: 'Outerwear',        color: 'beige',  age: '0-2Y',  sustainability: false, img: '/images/product2.png',badge: null,        stars: 4.2, reviews: 31  },
    { id: 9, name: 'Purl Knit Dungarees',      price: '$15.99', oldPrice: null,     category: 'Outerwear',        color: 'blue',   age: '0-2Y',  sustainability: true,  img: '/images/product3.png',badge: null,        stars: 4.7, reviews: 88  },
    { id: 10, name: '2-piece Set Light Pink',  price: '$24.99', oldPrice: null,     category: 'Dresses & Skirts', color: 'pink',   age: '0-2Y',  sustainability: false, img: '/images/product4.png',badge: null,        stars: 4.4, reviews: 67  },
    { id: 11, name: 'Soft Pointelle Cardigan', price: '$42.00', oldPrice: null,     category: 'Knitwear',         color: 'cream',  age: '0-2Y',  sustainability: true,  img: '/images/like4.png',   badge: null,        stars: 4.6, reviews: 95  },
    { id: 12, name: 'Everyday Denim Overalls', price: '$52.50', oldPrice: null,     category: 'Outerwear',        color: 'blue',   age: '0-2Y',  sustainability: false, img: '/images/like3.png',   badge: null,        stars: 4.3, reviews: 74  },
  ],
  toddler: [
    { id: 1, name: 'Floral Bloom Dress',       price: '$68.00', oldPrice: null,     category: 'Dresses & Skirts', color: 'pink',   age: '3-6Y',  sustainability: true,  img: '/images/prod-t1.png', badge: null,        stars: 4.5, reviews: 61  },
    { id: 2, name: 'Ocean Adventure Set',      price: '$74.00', oldPrice: '$90.00', category: 'Tops & Tees',      color: 'blue',   age: '3-6Y',  sustainability: false, img: '/images/prod-t2.png', badge: 'Best Seller',stars: 4.7, reviews: 210 },
    { id: 3, name: 'Meadow Print Romper',      price: '$58.00', oldPrice: null,     category: 'Outerwear',        color: 'green',  age: '3-6Y',  sustainability: true,  img: './images/prod-t3.png', badge: null,        stars: 4.3, reviews: 48  },
    { id: 4, name: 'Cosy Fleece Jacket',       price: '$95.00', oldPrice: null,     category: 'Outerwear',        color: 'beige',  age: '3-6Y',  sustainability: true,  img: './images/prod-t4.png', badge: null,        stars: 4.6, reviews: 122 },
    { id: 5, name: 'Rainbow Knit Pullover',    price: '$82.00', oldPrice: '$100.00',category: 'Knitwear',         color: 'cream',  age: '3-6Y',  sustainability: false, img: './images/prod-t5.png', badge: null,        stars: 4.1, reviews: 37  },
    { id: 6, name: 'Linen Play Shorts Set',    price: '$48.00', oldPrice: null,     category: 'Tops & Tees',      color: 'beige',  age: '3-6Y',  sustainability: true,  img: './images/prod-t6.png', badge: null,        stars: 4.4, reviews: 93  },
    { id: 7, name: 'Striped Sun Dress',        price: '$54.00', oldPrice: null,     category: 'Dresses & Skirts', color: 'blue',   age: '3-6Y',  sustainability: false, img: './images/like1.png',   badge: null,        stars: 4.2, reviews: 55  },
    { id: 8, name: 'Soft Denim Dungarees',     price: '$62.00', oldPrice: null,     category: 'Outerwear',        color: 'blue',   age: '3-6Y',  sustainability: true,  img: './images/like3.png',   badge: null,        stars: 4.8, reviews: 178 },
  ],
  junior: [
    { id: 1, name: 'Quilted Heritage Jacket',  price: '$64.00', oldPrice: null,     category: 'Outerwear',        color: 'green',  age: '7-12Y', sustainability: true,  img: './images/like1.png',   badge: null,        stars: 4.5, reviews: 88  },
    { id: 2, name: 'Essentials Ribbed Set',    price: '$48.00', oldPrice: '$60.00', category: 'Tops & Tees',      color: 'beige',  age: '7-12Y', sustainability: false, img: './images/like2.png',   badge: 'Best Seller',stars: 4.6, reviews: 145 },
    { id: 3, name: 'Everyday Denim Overalls',  price: '$52.50', oldPrice: null,     category: 'Outerwear',        color: 'blue',   age: '7-12Y', sustainability: true,  img: './images/like3.png',   badge: null,        stars: 4.3, reviews: 62  },
    { id: 4, name: 'Soft Pointelle Cardigan',  price: '$42.00', oldPrice: null,     category: 'Knitwear',         color: 'cream',  age: '7-12Y', sustainability: true,  img: './images/like4.png',   badge: null,        stars: 4.7, reviews: 201 },
    { id: 5, name: 'Classic Chino Trousers',   price: '$55.00', oldPrice: null,     category: 'Tops & Tees',      color: 'beige',  age: '7-12Y', sustainability: false, img: './images/prod-n6.png', badge: null,        stars: 4.2, reviews: 43  },
    { id: 6, name: 'Wool Blend Overcoat',      price: '$120.00',oldPrice: null,     category: 'Outerwear',        color: 'grey',   age: '7-12Y', sustainability: true,  img: './images/prod-n3.png', badge: null,        stars: 4.9, reviews: 317 },
  ],
};

const AGE_META = {
  newborn: { label: "Newborn's",  range: '0-2 Years',  banner: './images/age-0-2.png'  },
  toddler: { label: 'Toddler',    range: '3-6 Years',  banner: './images/age-3-6.png'  },
  junior:  { label: 'Junior',     range: '7-12 Years', banner: './images/age-7-12.png' },
};

const PRODUCTS_PER_PAGE = 6;

const SORT_OPTIONS = ['Newest Arrivals', 'Price: Low to High', 'Price: High to Low', 'Best Rated'];

export default function AgeGroupPage() {
  const { ageGroup } = useParams();
  const navigate = useNavigate();

  const meta = AGE_META[ageGroup] || AGE_META.newborn;
  const products = allProducts[ageGroup] || allProducts.newborn;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors]         = useState([]);
  const [sustainableOnly, setSustainableOnly]       = useState(false);
  const [sortBy, setSortBy]                         = useState('Newest Arrivals');
  const [currentPage, setCurrentPage]               = useState(1);

  // ── Filter ──
  let filtered = [...products];
  if (selectedCategories.length > 0)
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  if (selectedColors.length > 0)
    filtered = filtered.filter(p => selectedColors.includes(p.color));
  if (sustainableOnly)
    filtered = filtered.filter(p => p.sustainability);

  // ── Sort ──
  if (sortBy === 'Price: Low to High')
    filtered.sort((a, b) => parseFloat(a.price.replace('$','')) - parseFloat(b.price.replace('$','')));
  if (sortBy === 'Price: High to Low')
    filtered.sort((a, b) => parseFloat(b.price.replace('$','')) - parseFloat(a.price.replace('$','')));
  if (sortBy === 'Best Rated')
    filtered.sort((a, b) => b.stars - a.stars);

  // ── Paginate ──
  const totalPages  = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const startIndex  = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginated   = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="agp-page">
      {/* Banner */}
      <AgeGroupBanner meta={meta} />

      <div className="section-inner">
        <div className="agp-layout">

          {/* ── Left: Filter Sidebar ── */}
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

          {/* ── Right: Products ── */}
          <div className="agp-right">

            {/* Toolbar */}
            <div className="agp-toolbar">
              <span className="agp-count">
                Showing <strong>{filtered.length}</strong> premium items
              </span>
              <div className="agp-sort">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                >
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={paginated} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="agp-pagination">
                <button
                  className="agp-page-btn agp-arrow"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`agp-page-btn${currentPage === page ? ' active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="agp-page-btn agp-arrow"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
