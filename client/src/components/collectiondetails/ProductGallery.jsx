import { useState } from 'react';
import ImageZoom from './ImageZoom';
import '../../styles/collectiondetails/ProductGallery.css';

const IMAGES = [
  { id: 1, src: '/images/img1.webp',                           alt: 'Garden Breeze Dress - Front'  },
  { id: 2, src: '/images/products/garden-breeze-dress-2.jpg', alt: 'Garden Breeze Dress - Detail' },
  { id: 3, src: '/images/products/garden-breeze-dress-3.jpg', alt: 'Garden Breeze Dress - Side'   },
];

export default function ProductGallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="pg-wrapper">
      <div className="pg-main">
        <ImageZoom src={IMAGES[active].src} alt={IMAGES[active].alt} />
      </div>
      <div className="pg-thumbs">
        {IMAGES.map((img, i) => (
          <button
            key={img.id}
            className={`pg-thumb${active === i ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            <img src={img.src} alt={img.alt} />
          </button>
        ))}
      </div>
    </div>
  );
}