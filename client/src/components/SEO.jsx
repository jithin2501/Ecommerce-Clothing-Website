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
  const defaultImage = "https://sumathitrends.com/images/logo/logo.png";
  const defaultKeywords = "Sumathi Trends, kids clothing Bengaluru, best kids cloth wares in Kodigehalli, birthday party frocks, children fashion, wedding festive frocks, reception evening wear, photoshoot special frocks, princess fancy dress, casual cotton frocks, playtime frocks, school casual frocks, summer wear frocks, comfortable home wear, net frocks, gown style frocks, layered frill frocks, sequin glitter frocks, designer party wear, boutique designer frocks, handwork embroidery frocks, custom made frocks, luxury collection, pattu silk frocks, lehenga style frocks, anarkali frocks, indo-western styles, festival special diwali navratri, cotton frocks, satin frocks, silk frocks, organza frocks, velvet frocks winter special, premium kids boutique bangalore, hebbal kids store";
  
  const siteTitle = title ? `${title} | ${siteName}` : siteName;
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
