import { ArrowRight } from 'lucide-react';
import '../styles/Hero.css';

const avatarUrls = [
  'https://i.pravatar.cc/100?u=11',
  'https://i.pravatar.cc/100?u=22',
  'https://i.pravatar.cc/100?u=33',
];

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="section-inner">
        <div className="hero">

          {/* Left: Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="line-1">Modern Style</span>
              <span className="line-2">
                for <span className="accent-inline">Little</span>
              </span>
              <span className="accent">Legends</span>
            </h1>

            <p className="hero-desc">
              Crafted with love using premium organic cotton and linen.
              Designed for comfort, style, and every little adventure from ages 0–12.
            </p>

            <a href="#collections" className="btn-collection">
              View Collection
              <ArrowRight size={18} />
            </a>

            <div className="trust-bar">
              <div className="trust-avatars">
                {avatarUrls.map((url, i) => (
                  <div
                    key={i}
                    className="avatar-pill"
                    style={{ backgroundImage: `url(${url})` }}
                  />
                ))}
              </div>
              <div className="trust-text">
                <span>2,400+</span> Happy parents trust us
              </div>
            </div>
          </div>

          {/* Right: Visuals */}
          <div className="hero-visuals">
            <div className="img-bg-blob" />
            <img
              src="./images/banner2.png"
              alt="Model"
              className="main-model"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1519234221711-37d353664d92?q=80&w=800&auto=format&fit=crop';
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}