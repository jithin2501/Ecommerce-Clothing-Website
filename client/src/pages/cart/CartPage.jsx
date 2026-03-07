import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItems from '../../components/cart/CartItems';
import OrderSummary from '../../components/cart/OrderSummary';
import CartYouMightAlsoLike from '../../components/cart/CartYouMightAlsoLike';
import EmptyCart from '../../components/cart/EmptyCart';
import '../../styles/cart/CartPage.css';

const FREE_SHIPPING_THRESHOLD = 136;

export default function CartPage() {
  const { cartItems, updateQty, removeItem, subtotal } = useCart();

  if (cartItems.length === 0) return <EmptyCart />;

  const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const total     = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="cp-page">
      <div className="cp-inner">

        <p className="cp-breadcrumb"><Link to="/">Home</Link> › Shopping Bag</p>

        <h1 className="cp-title">
          Your Shopping Bag
          <span className="cp-count">({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})</span>
        </h1>

        {/* Free shipping bar */}
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
          <CartItems items={cartItems} onUpdateQty={updateQty} onRemove={removeItem} />
          <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
        </div>

        <CartYouMightAlsoLike />
      </div>
    </div>
  );
}
