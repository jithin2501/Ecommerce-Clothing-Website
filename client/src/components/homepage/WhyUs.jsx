import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import '../../styles/homepage/WhyUs.css';

const items = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $100' },
  { icon: ShieldCheck, title: 'Money Guarantee', desc: 'Within 30 days for exchange' },
  { icon: Headphones, title: 'Online Support', desc: '24 hours a day, 7 days a week' },
  { icon: CreditCard, title: 'Flexible Payment', desc: 'Pay with multiple credit cards' },
];

export default function WhyUs() {
  return (
    <section className="why-section" style={{ paddingBottom: '0', marginBottom: '0' }}>
      <div className="section-inner">
        <h2 className="why-title-label">
          Why <span>Choosing Us</span>
        </h2>
        <div className="why-grid">
          <div className="why-content">
            <h3 className="why-headline">
              Delivering Value, Reliability,
              <br />
              <span style={{ color: 'var(--accent-clay)' }}>and Peace of Mind.</span>
            </h3>
            <p className="why-desc">
              We go beyond just clothing — we build trust with every stitch. From
              the moment you place your order to the day it arrives at your door,
              our commitment is to make your experience smooth, safe, and truly
              worthwhile for your little ones.
            </p>
            <div className="why-items">
              {items.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="why-item">
                  <div className="why-item-icon">
                    <Icon size={22} />
                  </div>
                  <div className="why-item-text">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="why-visuals">
            <div className="why-blob" />
            <div className="why-dot why-dot-1" />
            <div className="why-dot why-dot-2" />
            <div className="why-dot why-dot-3" />
            <img
              src="images/homepage/WhyChoosing.png"
              alt="Why Choose Sumathi Trends"
              className="why-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}