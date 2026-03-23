import { useState } from 'react';
import ImageZoom from './ImageZoom';
import ImageLightbox from './ImageLightbox';
import '../../styles/collectiondetails/ProductGallery.css';

export default function ProductGallery({ images = [], onZoomChange }) {
  const [active, setActive]           = useState(0);
  const [lightbox, setLightbox]       = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Normalise DB string URLs into the same {id, src, alt} shape the original used
  const IMAGES = images.map((img, i) =>
    typeof img === 'string'
      ? { id: i + 1, src: img, alt: `Product image ${i + 1}` }
      : { id: img.id ?? i + 1, src: img.src, alt: img.alt ?? `Product image ${i + 1}` }
  );

  const openLightbox = (idx) => { setLightboxIdx(idx); setLightbox(true); };
  const closeLightbox = () => setLightbox(false);
  const goPrev = () => setLightboxIdx(i => Math.max(0, i - 1));
  const goNext = () => setLightboxIdx(i => Math.min(IMAGES.length - 1, i + 1));

  if (IMAGES.length === 0) return null;

  return (
    <>
      <div className="pg-wrapper">
        <div className="pg-main" onClick={() => openLightbox(active)}>
          <ImageZoom
            src={IMAGES[active].src}
            alt={IMAGES[active].alt}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="pg-thumbs">
          {IMAGES.map((img, i) => (
            <button
              key={img.id}
              className={`pg-thumb${active === i ? ' active' : ''}`}
              onClick={() => { setActive(i); onZoomChange({ active: false }); }}
            >
              <img src={img.src} alt={img.alt} />
            </button>
          ))}
        </div>
      </div>

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