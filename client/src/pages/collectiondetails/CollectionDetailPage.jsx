import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductGallery from '../../components/collectiondetails/ProductGallery';
import ProductInfo from '../../components/collectiondetails/ProductInfo';
import ProductAccordion from '../../components/collectiondetails/ProductAccordion';
import ProductReviews from '../../components/collectiondetails/ProductReviews';
import ProductRelated from '../../components/collectiondetails/ProductRelated';
import '../../styles/collectiondetails/CollectionDetailPage.css';

export default function CollectionDetailPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [zoomState, setZoomState] = useState({ active: false });
  const handleZoomChange = useCallback((state) => setZoomState(state), []);

  return (
    <div className="cdp-page">

      {/* Breadcrumb */}
      <div className="cdp-breadcrumb">
        <Link to="/">Home</Link>
        <span className="cdp-sep">›</span>
        <Link to="/collections">Collections</Link>
        <span className="cdp-sep">›</span>
        <Link to="/collections/dresses-skirts">Dresses &amp; Skirts</Link>
        <span className="cdp-sep">›</span>
        <span className="cdp-crumb-active">Garden Breeze Dress</span>
      </div>

      {/* Main product grid */}
      <div className="cdp-main">

        {/* LEFT — Gallery */}
        <ProductGallery onZoomChange={handleZoomChange} />

        {/* RIGHT — zoom panel + product info */}
        <div className="cdp-right-col">

          {/* Zoom panel — same aspect ratio as left image */}
          {zoomState.active && (
            <div className="cdp-zoom-panel-wrap">
              <div
                className="cdp-zoom-panel"
                style={{
                  backgroundImage:    `url(${zoomState.src})`,
                  backgroundSize:     zoomState.bgSize,
                  backgroundPosition: zoomState.bgPos,
                  backgroundRepeat:   'no-repeat',
                }}
              />
            </div>
          )}

          {/* Product info — fades out during zoom */}
          <div className={`cdp-info-wrap${zoomState.active ? ' cdp-info-hidden' : ''}`}>
            <ProductInfo />
            <ProductAccordion />
          </div>

        </div>
      </div>

      {/* Lower sections */}
      <div className="cdp-lower">
        <ProductReviews />
        <ProductRelated />
      </div>

    </div>
  );
}