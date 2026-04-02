import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItems from '../../components/cart/CartItems';
import OrderSummary from '../../components/cart/OrderSummary';
import CartYouMightAlsoLike from '../../components/cart/CartYouMightAlsoLike';
import EmptyCart from '../../components/cart/EmptyCart';
import AddressSidebar from '../../components/collectiondetails/AddressSidebar';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MapPin } from 'lucide-react';
import '../../styles/cart/CartPage.css';

const API = 'http://localhost:5000/api';

const FREE_SHIPPING_THRESHOLD = 136;
const GIFT_WRAP_COST = 6;

export default function CartPage() {
  const { cartItems, updateQty, removeItem, subtotal } = useCart();
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem('sumathi_selected_address', JSON.stringify(addr));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // Priority 1: Check localStorage for a manual selection made in this session
      const savedSelection = localStorage.getItem('sumathi_selected_address');
      if (savedSelection) {
        try {
          setSelectedAddress(JSON.parse(savedSelection));
          if (user) {
             const res = await fetch(`${API}/client-auth/addresses/${user.uid}`);
             const data = await res.json();
             if (data.success) setUserInfo(data.user);
          }
          return;
        } catch (e) {}
      }

      if (user) {
        try {
          const res = await fetch(`${API}/client-auth/addresses/${user.uid}`);
          const data = await res.json();
          if (data.success && data.addresses) {
            setUserInfo(data.user);
            const defAddr = data.addresses.find(a => a.isDefault);
            if (defAddr) setSelectedAddress(defAddr);
          }
        } catch (e) {}
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem('sumathi_addresses') || '[]');
          const defAddr = saved.find(a => a.isDefault);
          if (defAddr) setSelectedAddress(defAddr);
        } catch (e) {}
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // If returning from a product page via "You Might Also Love",
    // scroll to that section instead of the top
    if (sessionStorage.getItem('restoreCartScroll') === '1') {
      sessionStorage.removeItem('restoreCartScroll');
      let attempts = 0;
      const tryScroll = () => {
        const el = document.querySelector('.cyl-section');
        if (el && el.getBoundingClientRect().height > 0) {
          const navEl = document.querySelector('nav');
          const navHeight = navEl ? navEl.getBoundingClientRect().height : 80;
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
        } else if (attempts < 60) {
          attempts++;
          setTimeout(tryScroll, 50);
        }
      };
      requestAnimationFrame(tryScroll);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  if (cartItems.length === 0) return <EmptyCart />;

  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const giftCost  = giftWrapping ? GIFT_WRAP_COST : 0;
  const total     = subtotal + shipping + giftCost;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="cp-page">
      <div className="cp-inner">

        <p className="cp-breadcrumb"><Link to="/">Home</Link> › Shopping Bag</p>

        <h1 className="cp-title">
          Your Shopping Bag
          <span className="cp-count">({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})</span>
        </h1>

        <div className="cp-free-bar">
          <div className="cp-free-bar-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            Free Shipping Status
          </div>
          <div className="cp-free-bar-track">
            <div className="cp-free-bar-fill" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
          </div>
          <span className="cp-free-bar-label">
            {remaining > 0
              ? `Spend ₹${remaining.toFixed(2)} more for free shipping`
              : '🎉 You have free shipping!'}
          </span>
        </div>

        <div className="cp-grid">
          <div className="cp-left-col">
            {/* ── Delivery Address Bar ── */}
            <div className="cp-addr-bar">
              <div className="cp-addr-bar-left">
                <MapPin size={18} className="cp-addr-pin" />
                <div className="cp-addr-bar-content">
                  {selectedAddress ? (
                    <>
                      <p className="cp-addr-line-1">
                        Deliver to: <strong>{selectedAddress.name}</strong>, {selectedAddress.pincode}
                      </p>
                      <p className="cp-addr-line-2">
                        {selectedAddress.line1}, {selectedAddress.city}
                      </p>
                    </>
                  ) : (
                    <p className="cp-addr-none">No delivery address selected</p>
                  )}
                </div>
              </div>
              <button className="cp-addr-change-btn-link" onClick={() => setIsSidebarOpen(true)}>
                {selectedAddress ? 'CHANGE' : 'ADD NEW'}
              </button>
            </div>

            <CartItems
              items={cartItems}
              onUpdateQty={updateQty}
              onRemove={removeItem}
              onGiftChange={setGiftWrapping}
            />
          </div>

          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            giftWrapping={giftWrapping}
            giftCost={giftCost}
            total={total}
            user={auth.currentUser ? {
                uid: auth.currentUser.uid,
                name: auth.currentUser.displayName || userInfo?.name,
                email: auth.currentUser.email || userInfo?.email,
                phone: auth.currentUser.phoneNumber || userInfo?.phone
            } : null}
            cartItems={cartItems}
            selectedAddress={selectedAddress}
          />
        </div>

        <AddressSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onSelectAddress={handleSelectAddress} 
        />

        <CartYouMightAlsoLike />
      </div>
    </div>
  );
}