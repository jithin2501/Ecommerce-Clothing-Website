import { useEffect, useState } from 'react';
import '../../styles/homepage/NewArrivals.css';

const API = 'http://localhost:5000/api/products';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/featured?section=newArrivals`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="new-arrivals-section">
      <div className="section-inner">

        <div className="new-arrivals-header">
          <h2 className="new-arrivals-title">
            <strong>New</strong> Arrivals
          </h2>
          <p className="new-arrivals-sub">
            Fresh styles just landed — handpicked for your little ones.
          </p>
        </div>

        <div className="na-grid">
          {products.map((product, i) => (
            <div key={product._id || i} className="na-card">
              <div className="na-img-wrap">
                <img src={product.img} alt={product.name} />
              </div>
              <div className="na-card-info">
                <div className="na-card-name">{product.name}</div>
                <div className="na-card-price">₹{product.price}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}