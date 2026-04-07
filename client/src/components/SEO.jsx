import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  url, 
  image 
}) {
  const siteName = "Sumathi Trends";
  const defaultDesc = "Shop premium organic cotton and linen clothing for kids aged 0-12. Modern style, comfort and quality at Sumathi Trends.";
  const defaultImage = "https://sumathitrends.com/images/logo.png";
  const defaultKeywords = "kids clothing, children fashion, Sumathi Trends, best premium cloths for childrens in kodigehalli, best premium cloths for childrens in hebbal";
  
  const siteTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{siteTitle}</title>
      {description && <meta name="description" content={description} />}
      {!description && <meta name="description" content={defaultDesc} />}
      <meta name="keywords" content={keywords || defaultKeywords} />
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={siteTitle} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : (
        <meta property="og:description" content={defaultDesc} />
      )}
      {url && <meta property="og:url" content={url} />}
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
