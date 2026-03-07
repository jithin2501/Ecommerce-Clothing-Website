import { Link } from 'react-router-dom';
import ProductGallery from '../../components/collectiondetails/ProductGallery';
import ProductInfo from '../../components/collectiondetails/ProductInfo';
import ProductAccordion from '../../components/collectiondetails/ProductAccordion';
import ProductReviews from '../../components/collectiondetails/ProductReviews';
import ProductRelated from '../../components/collectiondetails/ProductRelated';
import '../../styles/collectiondetails/CollectionDetailPage.css';

export default function CollectionDetailPage() {
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
        <ProductGallery />
        <div>
          <ProductInfo />
          <ProductAccordion />
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