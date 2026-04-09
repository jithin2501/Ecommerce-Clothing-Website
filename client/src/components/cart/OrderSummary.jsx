import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import '../../styles/cart/OrderSummary.css';

const API_BASE = '/api';

export default function OrderSummary({ subtotal, shipping, giftWrapping, giftCost, total, user, cartItems, selectedAddress }) {
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to continue with checkout.');
      return;
    }

    if (!selectedAddress) {
      alert('Please select a delivery address first.');
      return;
    }

    const customerPhone = selectedAddress.phone || user.phone;
    if (!customerPhone || customerPhone.trim() === '' || customerPhone === '+91') {
      alert('Please update your address with a valid 10-digit phone number before proceeding. Shiprocket requires this for delivery.');
      return;
    }

    if (isNaN(total) || total <= 0) {
      alert('Invalid cart total. Please check your items.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on the backend
      const res = await fetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: total,
          userId: user.uid,
          userName: user.name,
          userEmail: user.email,
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price,
            size: item.size,
            color: item.color,
            photo: item.img,
            img: item.img
          })),
          shippingAddress: {
            name: selectedAddress.name || user.name,
            phone: selectedAddress.phone || user.phone,
            address: `${selectedAddress.line1}, ${selectedAddress.city}`,
            pincode: selectedAddress.pincode,
            city: selectedAddress.city
          }
        })
      });
      const data = await res.json();
      console.log('📦 Create order response:', data);

      if (!data.success) {
        throw new Error(data.detail || data.error || 'Failed to create order');
      }

      // 2. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // 3. Open Razorpay checkout modal
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        alert('Payment configuration missing. Please contact support.');
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: 'Sumathi Trends',
        description: 'Quality Clothing for Your Little Ones',
        image: '/logo.png', // Replace with your actual logo path
        order_id: data.orderId,
        handler: async (response) => {
          // 4. Verify payment on the backend
          const verifyRes = await fetch(`${API_BASE}/payment/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert('🎉 Payment Successful! Your order has been placed.');
            clearCart();
            window.location.href = '/account/orders';
          } else {
            alert('⚠️ Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        notes: {
          address: `${selectedAddress.line1}, ${selectedAddress.city}`
        },
        theme: {
          color: '#2C3E50' // Matches your website theme
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`❌ Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      console.error('Checkout error:', err);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="os-wrapper">
      <h2 className="os-title">Order Summary</h2>

      <div className="os-rows">
        <div className="os-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="os-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
        </div>

        {giftWrapping && (
          <div className="os-row os-gift-row">
            <span>Gift Wrapping</span>
            <span>+₹{giftCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="os-row">
          <span>Estimated Tax</span>
          <span>₹0.00</span>
        </div>
      </div>

      <div className="os-total">
        <span>Total</span>
        <span className="os-total-amount">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>

      <button
        className="os-checkout-btn"
        onClick={handleCheckout}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? (
          'PROCESSING...'
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" />
              <path d="M16 8h4l3 5v3h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            CHECKOUT NOW
          </>
        )}
      </button>

      <div className="os-secure">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        SECURE CHECKOUT — Your data is encrypted and protected
      </div>
    </div>
  );
}