import { useState } from 'react';
import '../styles/NewArrivals.css';

// Tabs: Baby, Girls, Boys — exactly as in the original HTML
const TABS = ['Baby', 'Girls', 'Boys'];

const products = {
  Baby: [
    {
      name: 'Waffle Textured Plush Set',
      price: '$14.99',
      img: './images/product1.png',
      fallback: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Ribbed Jogging Set',
      price: '$14.99',
      img: './images/product2.png',
      fallback: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Purl Knit Dungarees',
      price: '$7.99 – $15.99',
      img: './images/product3.png',
      fallback: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: '2-piece Set Light Pink',
      price: '$24.99',
      img: './images/product4.png',
      fallback: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600&auto=format&fit=crop',
    },
  ],
  Girls: [
    {
      name: '2-piece Set Light Pink',
      price: '$24.99',
      img: './images/product4.png',
      fallback: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Waffle Textured Plush Set',
      price: '$14.99',
      img: './images/product1.png',
      fallback: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Ribbed Jogging Set',
      price: '$14.99',
      img: './images/product2.png',
      fallback: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Purl Knit Dungarees',
      price: '$7.99 – $15.99',
      img: './images/product3.png',
      fallback: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=600&auto=format&fit=crop',
    },
  ],
  Boys: [
    {
      name: 'Purl Knit Dungarees',
      price: '$7.99 – $15.99',
      img: './images/product3.png',
      fallback: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Ribbed Jogging Set',
      price: '$14.99',
      img: './images/product2.png',
      fallback: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Waffle Textured Plush Set',
      price: '$14.99',
      img: './images/product1.png',
      fallback: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: '2-piece Set Light Pink',
      price: '$24.99',
      img: './images/product4.png',
      fallback: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600&auto=format&fit=crop',
    },
  ],
};

export default function NewArrivals() {
  // Default active tab is "Baby" — matches the HTML (first tab has class "active")
  const [activeTab, setActiveTab] = useState('Baby');
  const items = products[activeTab] || [];

  return (
    <section className="new-arrivals-section">
      <div className="section-inner">

        {/* Title: <strong>New</strong> Arrivals — matches HTML exactly */}
        <div className="new-arrivals-header">
          <h2 className="new-arrivals-title">
            <strong>New</strong> Arrivals
          </h2>
        </div>

        {/* Tabs are OUTSIDE the header div — matches HTML structure */}
        <div className="na-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`na-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="na-grid">
          {items.map((product, i) => (
            <div key={i} className="na-card">
              <div className="na-img-wrap">
                <img
                  src={product.img}
                  alt={product.name}
                  onError={(e) => { e.target.src = product.fallback; }}
                />
              </div>
              <div className="na-card-info">
                <div className="na-card-name">{product.name}</div>
                <div className="na-card-price">{product.price}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}