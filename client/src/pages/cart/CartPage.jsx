import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItems from '../../components/cart/CartItems';
import OrderSummary from '../../components/cart/OrderSummary';
import CartYouMightAlsoLike from '../../components/cart/CartYouMightAlsoLike';
import EmptyCart from '../../components/cart/EmptyCart';
import '../../styles/cart/CartPage.css';

const FREE_SHIPPING_THRESHOLD = 136;
const GIFT_WRAP_COST = 6;

export default function CartPage() {
  const { cartItems, updateQty, removeItem, subtotal } = useCart();
  const [giftWrapping, setGiftWrapping] = useState(false);

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
              ? `Spend $${remaining.toFixed(2)} more for free shipping`
              : '🎉 You have free shipping!'}
          </span>
        </div>

        <div className="cp-grid">
          <CartItems
            items={cartItems}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onGiftChange={setGiftWrapping}
          />
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            giftWrapping={giftWrapping}
            giftCost={giftCost}
            total={total}
          />
        </div>

        <CartYouMightAlsoLike />
      </div>
    </div>
  );
}