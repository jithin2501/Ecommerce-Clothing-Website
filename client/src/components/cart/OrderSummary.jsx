import '../../styles/cart/OrderSummary.css';

export default function OrderSummary({ subtotal, shipping, giftWrapping, giftCost, total }) {
  return (
    <div className="os-wrapper">
      <h2 className="os-title">Order Summary</h2>

      <div className="os-rows">
        <div className="os-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="os-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>

        {giftWrapping && (
          <div className="os-row os-gift-row">
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                <polyline points="20 12 20 22 4 22 4 12"/>
                <rect x="2" y="7" width="20" height="5"/>
                <path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
              </svg>
              Gift Wrapping
            </span>
            <span>+${giftCost.toFixed(2)}</span>
          </div>
        )}

        <div className="os-row">
          <span>Estimated Tax</span>
          <span>$0.00</span>
        </div>
      </div>

      <div className="os-total">
        <span>Total</span>
        <span className="os-total-amount">${total.toFixed(2)}</span>
      </div>

      <button className="os-checkout-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13"/>
          <path d="M16 8h4l3 5v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        CHECKOUT NOW
      </button>

      <div className="os-secure">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        SECURE CHECKOUT — Your data is encrypted and protected
      </div>
    </div>
  );
}