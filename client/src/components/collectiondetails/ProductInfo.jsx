import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, MapPin, Truck, Package, RotateCcw, Banknote, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import AddToCartBtn from './AddToCartBtn';
import ShareModal from './ShareModal';
import '../../styles/collectiondetails/ProductInfo.css';

const BADGES = [
  { icon: RotateCcw,   label: '10-Day',  sub: 'Return'   },
  { icon: Banknote,    label: 'Cash on', sub: 'Delivery' },
  { icon: ShieldCheck, label: 'Quality', sub: 'Assured'  },
];

const AGE_LABELS = {
  'newborn': '0–6 Months', 'infant': '6–12 Months', 'toddler': '1–3 Years', 
  'little-girls': '3–6 Years', 'kids': '6–9 Years', 'pre-teen': '9–12 Years'
};

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
  selectedAddress = null,
  onOpenSidebar = () => {},
  userInfo = null,
  auth = null,
  inventory = {},
  stock = 0
}) {
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);

  const productUrl = window.location.href;

  const selectedColorHex = colors.find(c => c.name === selectedColor)?.hex || '#2D3E50';

  const isAvailable = stock > 0;
  const isOut = !isAvailable;

  const handleBeforeAdd = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return false;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address before adding to cart.");
      onOpenSidebar();
      return false;
    }
    
    // Auth requirements for strict validation
    if (auth?.currentUser && userInfo) {
      const isGoogle = userInfo.loginType === 'google' || auth.currentUser.providerData[0]?.providerId === 'google.com';
      const isPhone  = userInfo.loginType === 'phone' || auth.currentUser.providerData[0]?.providerId === 'phone';

      if (isGoogle && !userInfo.phone) {
        alert("Please complete your Personal Information (Phone number) in your account before adding to cart.");
        navigate('/account');
        return false;
      } 
      
      if (isPhone && !userInfo.fullName) {
        alert("Please complete your Personal Information (Name) in your account before adding to cart. No email is required.");
        navigate('/account');
        return false;
      }
      
      if (!isGoogle && !isPhone && (!userInfo.fullName || !userInfo.phone)) {
        alert("Please complete your Personal Information in your account before adding to cart.");
        navigate('/account');
        return false;
      }
    } else if (auth && !auth.currentUser) {
      alert("Please login to add items to your cart.");
      navigate('/login');
      return false;
    }

    return true;
  };

  const handleAddToBag = () => {
    addToCart({
      id:    productId || 1,
      name,
      price: typeof price === 'number' ? price : parseFloat(String(price).replace(/[₹$,]/g, '')),
      size:  selectedSize,
      color: selectedColor,
      img:   galleryImg,
      stock: stock,
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
          {sizes.map(s => {
            return (
              <button
                key={s}
                className={`pi-size-btn${selectedSize === s ? ' active' : ''}${isOut ? ' out-of-stock' : ''}`}
                onClick={() => setSelectedSize(s)}
                disabled={isOut}
                title={isOut ? 'Currently Unavailable' : ''}
              >
                {s}
              </button>
            );
          })}
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
          onBeforeAdd={handleBeforeAdd}
          onAdd={handleAddToBag}
          onGoToBag={() => navigate('/cart')}
          shirtColor={selectedColorHex}
          isAvailable={isAvailable}
        />
        <button 
          className={`pi-icon-btn${isWishlisted(productId) ? ' active' : ''}`} 
          onClick={() => toggleWishlist({ id: productId, name, price, img: galleryImg, category: 'Product' })}
          style={{ color: isWishlisted(productId) ? '#e11d48' : 'inherit' }}
        >
          <Heart size={18} fill={isWishlisted(productId) ? '#e11d48' : 'none'} stroke={isWishlisted(productId) ? '#e11d48' : 'currentColor'} />
        </button>
        <button 
          className="pi-icon-btn" 
          onClick={() => setIsShareOpen(true)}
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="pi-delivery">
        <p className="pi-delivery-title">Delivery details</p>
        <ul className="pi-delivery-list">
          <li>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: '4px' }} />
            <span style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {selectedAddress ? (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px', display: 'inline-block' }}>
                    <span style={{fontWeight:'bold'}}>{selectedAddress.name}</span>, {selectedAddress.line1}, {selectedAddress.city} - {selectedAddress.pincode}
                  </span>
                  <a href="#" onClick={(e) => { e.preventDefault(); onOpenSidebar(); }} style={{marginLeft: '8px', color: '#167a92', fontWeight: '500', flexShrink: 0}}>Change</a>
                </div>
              ) : (
                <span>Location not set. <a href="#" onClick={(e) => { e.preventDefault(); onOpenSidebar(); }} style={{color: '#167a92', fontWeight: '500', marginLeft: '4px'}}>Select delivery location</a></span>
              )}
            </span>
          </li>
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

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        productUrl={productUrl}
        productName={name}
      />
    </div>
  );
}
