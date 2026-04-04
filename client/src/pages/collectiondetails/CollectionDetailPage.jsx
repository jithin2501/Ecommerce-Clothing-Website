import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import ProductGallery   from '../../components/collectiondetails/ProductGallery';
import ProductInfo      from '../../components/collectiondetails/ProductInfo';
import ProductAccordion from '../../components/collectiondetails/ProductAccordion';
import ProductReviews   from '../../components/collectiondetails/ProductReviews';
import ProductRelated   from '../../components/collectiondetails/ProductRelated';
import AddressSidebar   from '../../components/collectiondetails/AddressSidebar';
import '../../styles/collectiondetails/CollectionDetailPage.css';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const API = '/api';

const slugToName = (slug) => slug.replace(/-/g, ' ').toLowerCase();

function scrollToSectionOnPage(sectionId) {
  let attempts = 0;
  const tryScroll = () => {
    const el = document.getElementById(sectionId);
    if (el && el.getBoundingClientRect().height > 0) {
      const navEl = document.querySelector('nav');
      const navHeight = navEl ? navEl.getBoundingClientRect().height : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    } else if (attempts < 60) {
      attempts++;
      setTimeout(tryScroll, 50);
    }
  };
  requestAnimationFrame(tryScroll);
}

export default function CollectionDetailPage() {
  const { productSlug, productId: paramProductId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fromState = location.state || {};

  // Scroll to top on every product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [productSlug, paramProductId]);

  // After returning to this page via back (from a deeper product),
  // scroll to the saved section (e.g. "you-might-also-like")
  useEffect(() => {
    const sectionId = sessionStorage.getItem('restorePdpSection');
    if (!sectionId) return;
    sessionStorage.removeItem('restorePdpSection');
    scrollToSectionOnPage(sectionId);
  }, []);

  // Intercept browser back button
  useEffect(() => {
    if (!fromState.restoreScroll) return;
    const handlePopState = () => {
      if (fromState.fromCart) {
        // Going back to cart — scroll to top of cart page is default browser behavior
        // restoreCartScroll flag not needed since cart scrolls to top naturally
      } else if (fromState.fromProductPage) {
        // restorePdpSection already in sessionStorage
      } else {
        sessionStorage.setItem('restoreHomeScroll', '1');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [fromState]);

  const [detail,       setDetail]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [notFound,     setNotFound]     = useState(false);
  const [activeImages, setActiveImages] = useState([]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [zoomState, setZoomState] = useState({ isZoomed: false, x: 0, y: 0 });

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem('sumathi_selected_address', JSON.stringify(addr));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // Priority 1: Check localStorage for a manual selection made in this session
      const savedSelection = localStorage.getItem('sumathi_selected_address');
      if (savedSelection) {
        try {
          setSelectedAddress(JSON.parse(savedSelection));
          if (user) {
             const res = await fetch(`${API}/client-auth/addresses/${user.uid}`);
             const data = await res.json();
             if (data.success) setUserInfo(data.user);
          }
          return;
        } catch (e) {}
      }

      if (user) {
        try {
          const res = await fetch(`${API}/client-auth/addresses/${user.uid}`);
          const data = await res.json();
          if (data.success && data.addresses) {
            setUserInfo(data.user);
            const defAddr = data.addresses.find(a => a.isDefault);
            if (defAddr) setSelectedAddress(defAddr);
          }
        } catch (e) {}
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem('sumathi_addresses') || '[]');
          const defAddr = saved.find(a => a.isDefault);
          if (defAddr) setSelectedAddress(defAddr);
        } catch (e) {}
      }
    });
    return () => unsub();
  }, []);

  const handleZoomChange  = useCallback((state) => setZoomState(state), []);

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
        if (!resolvedId && productSlug) {
          const res  = await fetch(`${API}/products`);
          const data = await res.json();
          if (data.success) {
            const needle  = slugToName(productSlug);
            const matched = data.data.find(p => p.name.toLowerCase() === needle);
            if (matched) resolvedId = matched._id;
          }
        }
        if (!resolvedId) { if (!cancelled) setNotFound(true); return; }
        const dRes  = await fetch(`${API}/product-details/${resolvedId}`);
        const dData = await dRes.json();
        if (!cancelled) {
          if (dData.success) {
            setDetail(dData.data);
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

  const handleBack = (e) => {
    e.preventDefault();
    if (fromState.fromCart) {
      // Navigate back to cart — browser back restores cart scroll position naturally
      navigate(-1);
    } else if (fromState.fromProductPage) {
      // restorePdpSection already in sessionStorage
      navigate(-1);
    } else if (fromState.restoreScroll) {
      sessionStorage.setItem('restoreHomeScroll', '1');
      navigate(-1);
    } else {
      navigate(-1);
    }
  };

  if (loading) return (
    <div className="cdp-page">
      <p style={{ padding: '4rem', textAlign: 'center', color: '#aaa' }}>Loading…</p>
    </div>
  );

  if (notFound || !detail) return (
    <div className="cdp-page">
      <p style={{ padding: '4rem', textAlign: 'center', color: '#aaa' }}>
        Product details not available yet.
      </p>
    </div>
  );

  const product = detail.product;

  const renderBreadcrumb = () => {
    if (fromState.fromLabel) {
      return (
        <div className="cdp-breadcrumb">
          <a href="/" onClick={handleBack}>Home</a>
          <span className="cdp-sep">›</span>
          {fromState.fromCart ? (
            <a href="/cart" onClick={handleBack}>{fromState.fromLabel}</a>
          ) : (
            <a href="/" onClick={handleBack}>{fromState.fromLabel}</a>
          )}
          <span className="cdp-sep">›</span>
          {product?.category && <><span>{product.category}</span><span className="cdp-sep">›</span></>}
          <span className="cdp-crumb-active">{product?.name || 'Product'}</span>
        </div>
      );
    }
    return (
      <div className="cdp-breadcrumb">
        <Link to="/" onClick={handleBack}>Home</Link>
        <span className="cdp-sep">›</span>
        <Link to="/collections" state={{}}>{fromState.fromLabel || 'Collections'}</Link>
        <span className="cdp-sep">›</span>
        <span className="cdp-crumb-active">{product?.name || 'Product'}</span>
      </div>
    );
  };

  return (
    <div className="cdp-page">
      {renderBreadcrumb()}
      <div className="cdp-main">
        <ProductGallery images={activeImages} onZoomChange={handleZoomChange} />
        <div className="cdp-right-col">
          {zoomState.active && (
            <div className="cdp-zoom-panel-wrap">
              <div className="cdp-zoom-panel" style={{
                backgroundImage: `url(${zoomState.src})`,
                backgroundSize: zoomState.bgSize,
                backgroundPosition: zoomState.bgPos,
                backgroundRepeat: 'no-repeat',
              }} />
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
              selectedAddress={selectedAddress}
              onOpenSidebar={() => setIsSidebarOpen(true)}
              userInfo={userInfo}
              auth={auth}
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
      <div className="cdp-lower">
        <ProductReviews />
        <ProductRelated />
      </div>

      <AddressSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onSelectAddress={handleSelectAddress} 
      />
    </div>
  );
}
