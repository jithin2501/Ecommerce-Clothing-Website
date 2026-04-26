import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  url, 
  image 
}) {
  const siteName = "Sumathi Trends";
  const defaultDesc = "Sumathi Trends is the best kids clothing store in Kodigehalli, Bangalore. Discover premium quality Occasion Wear, Party Wear, Traditional & Ethnic Wear, and Designer Frocks for your little ones.";
  const defaultKeywords = "Best kids clothing in Kodigehalli, Best kids clothing in Bangalore, Sumathi Trends, Kids Wear, Party Wear Frocks, Traditional Kids Wear, Designer Frocks Bangalore";
  
  const siteTitle = title ? `${title} | Sumathi Trends` : "Best Kids Clothing in Kodigehalli & Bangalore | Sumathi Trends";
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{siteTitle}</title>
      {description && <meta name="description" content={description} />}
      {!description && <meta name="description" content={defaultDesc} />}
      <meta name="keywords" content={keywords || defaultKeywords} />
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={siteTitle} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : (
        <meta property="og:description" content={defaultDesc} />
      )}
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {image ? (
        <meta property="og:image" content={image} />
      ) : (
        <meta property="og:image" content={defaultImage} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      {description ? (
        <meta name="twitter:description" content={description} />
      ) : (
        <meta name="twitter:description" content={defaultDesc} />
      )}
      {image ? (
        <meta name="twitter:image" content={image} />
      ) : (
        <meta name="twitter:image" content={defaultImage} />
      )}
    </Helmet>
  );
}
