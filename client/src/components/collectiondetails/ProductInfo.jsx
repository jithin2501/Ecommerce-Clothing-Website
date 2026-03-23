import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, MapPin, Truck, Package, RotateCcw, Banknote, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import AddToCartBtn from './AddToCartBtn';
import '../../styles/collectiondetails/ProductInfo.css';

const BADGES = [
  { icon: RotateCcw,   label: '10-Day',  sub: 'Return'   },
  { icon: Banknote,    label: 'Cash on', sub: 'Delivery' },
  { icon: ShieldCheck, label: 'Quality', sub: 'Assured'  },
];

export default function ProductInfo({
  name         = 'Garden Breeze Dress',
  price        = 0,
  oldPrice     = null,
  sizes        = [],
  colors       = [],
  deliveryDate = '5 Mar, Thu',
  productId    = null,
  galleryImg   = '',
  onColorChange = null,
}) {
  const [selectedSize,  setSelectedSize]  = useState(sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const [wishlisted,    setWishlisted]    = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToBag = () => {
    addToCart({
      id:    productId || 1,
      name,
      price: typeof price === 'number' ? `₹${price}` : price,
      size:  selectedSize,
      color: selectedColor,
      img:   galleryImg,
    });
  };

  const displayPrice = typeof price === 'number'
    ? `₹${price.toLocaleString('en-IN')}`
    : price;

  return (
    <div className="pi-wrapper">
      <h1 className="pi-title">{name}</h1>

      <div className="pi-rating">
        <span className="pi-stars">★★★★☆</span>
        <span className="pi-reviews">(42 Reviews)</span>
      </div>

      <p className="pi-price">{displayPrice}</p>

      <div className="pi-section">
        <p className="pi-label">SELECT SIZE</p>
        <div className="pi-sizes">
          {sizes.map(s => (
            <button
              key={s}
              className={`pi-size-btn${selectedSize === s ? ' active' : ''}`}
              onClick={() => setSelectedSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="pi-section">
        <p className="pi-label">COLOR: <span className="pi-color-name">{selectedColor}</span></p>
        <div className="pi-colors">
          {colors.map(c => (
            <button
              key={c.name}
              className={`pi-color-dot${selectedColor === c.name ? ' active' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => {
                setSelectedColor(c.name);
                if (onColorChange) onColorChange(c.name);
              }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="pi-actions">
        <AddToCartBtn
          onAdd={handleAddToBag}
          onGoToBag={() => navigate('/cart')}
        />
        <button className={`pi-icon-btn${wishlisted ? ' active' : ''}`} onClick={() => setWishlisted(p => !p)}>
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button className="pi-icon-btn"><Share2 size={18} /></button>
      </div>

      <div className="pi-delivery">
        <p className="pi-delivery-title">Delivery details</p>
        <ul className="pi-delivery-list">
          <li><MapPin size={14} /><span>Location not set. <a href="#">Select delivery location</a></span></li>
          <li><Truck size={14} /><span>Delivery by {deliveryDate}</span></li>
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