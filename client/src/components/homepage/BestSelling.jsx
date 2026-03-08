import '../../styles/homepage/BestSelling.css';

// Arrow icon — exactly as in the original HTML SVG
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

// 10 cards, 36° apart, translateZ(420px) — exact copy of the HTML
const cards = [
  { img: './images/new1.png', tag: 'Kids Fashion',   name: 'Spring Collection',  fallback: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400',  angle: 0   },
  { img: './images/new2.png', tag: 'Boys Wear',      name: 'Casual Everyday',    fallback: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=400',  angle: 36  },
  { img: './images/new3.png', tag: 'New Collection', name: 'Premium Kids Wear',  fallback: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400',  angle: 72  },
  { img: './images/new4.png', tag: 'Girls Wear',     name: 'Floral Summer',      fallback: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&q=80&w=400',  angle: 108 },
  { img: './images/new5.png', tag: 'Accessories',    name: 'Little Extras',      fallback: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=400',  angle: 144 },
  { img: './images/new1.png', tag: 'Tops',           name: 'Fresh Styles',       fallback: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=400',  angle: 180 },
  { img: './images/new2.png', tag: 'Dresses',        name: 'Summer Bloom',       fallback: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=400',  angle: 216 },
  { img: './images/new3.png', tag: 'Bottoms',        name: 'Denim Essentials',   fallback: 'https://images.unsplash.com/photo-1471560090527-d1af5e4e6eb6?auto=format&fit=crop&q=80&w=400',  angle: 252 },
  { img: './images/new4.png', tag: 'Outerwear',      name: 'Cosy Layers',        fallback: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=400',  angle: 288 },
  { img: './images/new5.png', tag: 'Footwear',       name: 'Step & Play',        fallback: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',    angle: 324 },
];

export default function BestSelling() {
  return (
    <section className="arrivals-section">
      <div className="section-inner">

        {/* Header — "<span>Best</span> Selling" matches original exactly */}
        <div className="best-selling-header">
          <h2 className="best-selling-title">
            <span>Best</span> Selling
          </h2>
          <p className="best-selling-sub">
            Our Most Loved Styles, Picked By Parents Everywhere.
          </p>
        </div>

        {/* 3D Orbit */}
        <div className="orbit-scene">
          <div className="orbit-ring">
            {cards.map((card, i) => (
              <div
                key={i}
                className="arr-card"
                style={{ transform: `rotateY(${card.angle}deg) translateZ(420px)` }}
              >
                <img
                  src={card.img}
                  alt={card.name}
                  onError={(e) => { e.target.src = card.fallback; }}
                />
                <div className="arr-card-overlay">
                  <div className="arr-hover-btn">
                    <ArrowIcon />
                  </div>
                  <div className="arr-hover-info">
                    <span className="arr-hover-tag">{card.tag}</span>
                    <div className="arr-hover-name">{card.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}