import { useState } from 'react';
import ImageZoom from './ImageZoom';
import ImageLightbox from './ImageLightbox';
import '../../styles/collectiondetails/ProductGallery.css';

const IMAGES = [
  { id: 1, src: '/images/image1.png', alt: 'Garden Breeze Dress - Front'  },
  { id: 2, src: '/images/image2.png', alt: 'Garden Breeze Dress - Detail' },
  { id: 3, src: '/images/image3.png', alt: 'Garden Breeze Dress - Side'   },
];

export default function ProductGallery() {
  const [active, setActive]         = useState(0);
  const [lightbox, setLightbox]     = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openLightbox = (idx) => {
    setLightboxIdx(idx);
    setLightbox(true);
  };

  const closeLightbox = () => setLightbox(false);

  const goPrev = () => setLightboxIdx(i => Math.max(0, i - 1));
  const goNext = () => setLightboxIdx(i => Math.min(IMAGES.length - 1, i + 1));

  return (
    <>
      <div className="pg-wrapper">
        {/* Main image with zoom + click to open lightbox */}
        <div
          className="pg-main"
          onClick={() => openLightbox(active)}
        >
          <ImageZoom src={IMAGES[active].src} alt={IMAGES[active].alt} />
        </div>

        {/* Thumbnails */}
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

      {/* Lightbox */}
      {lightbox && (
        <ImageLightbox
          images={IMAGES}
          activeIndex={lightboxIdx}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}