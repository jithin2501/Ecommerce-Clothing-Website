import { useState } from 'react';
import { Heart, Share2, ShoppingBag, MapPin, Truck, Package, RotateCcw, Banknote, ShieldCheck, ShoppingCart } from 'lucide-react';
import '../../styles/collectiondetails/ProductInfo.css';

const SIZES  = ['2-3Y', '4-5Y', '6-7Y', '8-9Y'];
const COLORS = [
  { name: 'blush', hex: '#F2C4B0' },
  { name: 'sage',  hex: '#A8C5A0' },
  { name: 'cream', hex: '#EDE8DC' },
];
const BADGES = [
  { icon: RotateCcw,   label: '10-Day',  sub: 'Return'   },
  { icon: Banknote,    label: 'Cash on', sub: 'Delivery' },
  { icon: ShieldCheck, label: 'Quality', sub: 'Assured'  },
];

export default function ProductInfo() {
  const [selectedSize,  setSelectedSize]  = useState('4-5Y');
  const [selectedColor, setSelectedColor] = useState('blush');
  const [wishlisted,    setWishlisted]    = useState(false);
  const [added,         setAdded]         = useState(false);

  return (
    <div className="pi-wrapper">
      <h1 className="pi-title">Garden Breeze Dress</h1>

      <div className="pi-rating">
        <span className="pi-stars">★★★★☆</span>
        <span className="pi-reviews">(42 Reviews)</span>
      </div>

      <p className="pi-price">$84.00</p>

      <div className="pi-section">
        <p className="pi-label">SELECT SIZE</p>
        <div className="pi-sizes">
          {SIZES.map(s => (
            <button key={s} className={`pi-size-btn${selectedSize === s ? ' active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="pi-section">
        <p className="pi-label">COLOR: <span className="pi-color-name">{selectedColor}</span></p>
        <div className="pi-colors">
          {COLORS.map(c => (
            <button key={c.name} className={`pi-color-dot${selectedColor === c.name ? ' active' : ''}`} style={{ backgroundColor: c.hex }} onClick={() => setSelectedColor(c.name)} title={c.name} />
          ))}
        </div>
      </div>

      <div className="pi-actions">
        {!added ? (
          <button className="pi-add-btn" onClick={() => setAdded(true)}>
            <ShoppingBag size={18} /> Add to Bag
          </button>
        ) : (
          <button className="pi-add-btn pi-go-to-bag" onClick={() => window.location.href = '/cart'}>
            <ShoppingCart size={18} /> Go to Bag
          </button>
        )}
        <button className={`pi-icon-btn${wishlisted ? ' active' : ''}`} onClick={() => setWishlisted(p => !p)} title="Wishlist">
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button className="pi-icon-btn" title="Share"><Share2 size={18} /></button>
      </div>

      <div className="pi-delivery">
        <p className="pi-delivery-title">Delivery details</p>
        <ul className="pi-delivery-list">
          <li><MapPin size={14} /><span>Location not set. <a href="#">Select delivery location</a></span></li>
          <li><Truck size={14} /><span>Delivery by 5 Mar, Thu</span></li>
          <li><Package size={14} /><span>Fulfilled by Sumathi Trends</span></li>
        </ul>
      </div>

      <div className="pi-badges">
        {BADGES.map(b => (
          <div key={b.label} className="pi-badge-item">
            <div className="pi-badge-icon"><b.icon size={16} strokeWidth={1.5} /></div>
            <p className="pi-badge-text">{b.label}<br />{b.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}