import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGallery   from '../../components/collectiondetails/ProductGallery';
import ProductInfo      from '../../components/collectiondetails/ProductInfo';
import ProductAccordion from '../../components/collectiondetails/ProductAccordion';
import ProductReviews   from '../../components/collectiondetails/ProductReviews';
import ProductRelated   from '../../components/collectiondetails/ProductRelated';
import '../../styles/collectiondetails/CollectionDetailPage.css';

const API = 'http://localhost:5000/api';

// Convert a URL slug like "midnight-grace" → "midnight grace"
// then match case-insensitively against product names
const slugToName = (slug) => slug.replace(/-/g, ' ').toLowerCase();

export default function CollectionDetailPage() {
  // Route can be either:
  //   /collections/:ageGroup/:productSlug   (existing slug-based links)
  //   /collections/product/:productId       (new _id-based links)
  const { productSlug, productId: paramProductId } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [detail,    setDetail]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [activeImages, setActiveImages] = useState([]);

  const [zoomState,       setZoomState]       = useState({ active: false });
  const handleZoomChange = useCallback((state) => setZoomState(state), []);

  const handleColorChange = useCallback((colorName) => {
    if (!detail?.colorGalleries?.length) return;
    const key   = colorName.toLowerCase().replace(/\s+/g, '_');
    const entry = detail.colorGalleries.find(g => g.colorName === key);
    if (entry?.images?.length) {
      setActiveImages(entry.images);
      setZoomState({ active: false });
    }
  }, [detail]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setDetail(null);

      try {
        let resolvedId = paramProductId || null;

        // ── If we only have a slug, resolve it to a product _id ──
        if (!resolvedId && productSlug) {
          const res  = await fetch(`${API}/products`);
          const data = await res.json();
          if (data.success) {
            const needle  = slugToName(productSlug);
            const matched = data.data.find(
              (p) => p.name.toLowerCase() === needle
            );
            if (matched) {
              resolvedId = matched._id;
            }
          }
        }

        if (!resolvedId) {
          if (!cancelled) setNotFound(true);
          return;
        }

        // ── Fetch the detail document ──
        const dRes  = await fetch(`${API}/product-details/${resolvedId}`);
        const dData = await dRes.json();

        if (!cancelled) {
          if (dData.success) {
            setDetail(dData.data);
            // Default to first color's gallery, fallback to flat galleryImages
            const firstColorGallery = dData.data.colorGalleries?.[0]?.images;
            setActiveImages(firstColorGallery?.length ? firstColorGallery : (dData.data.galleryImages || []));
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [productSlug, paramProductId]);

  /* ── Render states ── */
  if (loading) {
    return (
      <div className="cdp-page">
        <p style={{ padding: '4rem', textAlign: 'center', color: '#aaa' }}>Loading…</p>
      </div>
    );
  }

  if (notFound || !detail) {
    return (
      <div className="cdp-page">
        <p style={{ padding: '4rem', textAlign: 'center', color: '#aaa' }}>
          Product details not available yet.
        </p>
      </div>
    );
  }

  const product = detail.product; // populated: { name, price, oldPrice, … }

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
        <span className="cdp-crumb-active">{product?.name || 'Product'}</span>
      </div>

      {/* Main product grid */}
      <div className="cdp-main">

        {/* LEFT — Gallery */}
        <ProductGallery
          images={activeImages}
          onZoomChange={handleZoomChange}
        />

        {/* RIGHT — zoom panel + product info */}
        <div className="cdp-right-col">

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

          <div className={`cdp-info-wrap${zoomState.active ? ' cdp-info-hidden' : ''}`}>
            <ProductInfo
              name={product?.name}
              price={product?.price}
              oldPrice={product?.oldPrice}
              sizes={detail.sizes}
              colors={detail.colors}
              deliveryDate={detail.deliveryDate}
              productId={detail.product?._id}
              galleryImg={activeImages?.[0]}
              onColorChange={handleColorChange}
            />
            <ProductAccordion
              specifications={detail.specifications}
              description={detail.description}
              manufacturerInfo={detail.manufacturerInfo}
              highlights={detail.highlights}
            />
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