import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  url, 
  image 
}) {
  const siteName = "Sumathi Trends";
  const defaultDesc = "Sumathi Trends is the top-rated kids clothing store in Bangalore, Karnataka, specializing in ages 0-12 years. Shop best quality Occasion Wear, Party Wear, Traditional Ethnic Wear, and Designer Frocks in Kodigehalli and across Bangalore.";
  const defaultKeywords = "Best kids clothing Bangalore, kids clothes Bangalore Karnataka, 0-12 years kids wear Bangalore, Sumathi Trends, Kids Wear Kodigehalli, Party Wear Frocks Bangalore, Traditional Kids Wear Karnataka, Designer Frocks for girls Bangalore";
  const defaultImage = "https://sumathitrends.com/images/logo/logo.png";
  
  const siteTitle = title ? `${title} | Sumathi Trends` : "Best Kids Clothes Wear in Bangalore Karnataka | 0-12 Years | Sumathi Trends";
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  // Schema.org JSON-LD for Local Business
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Sumathi Trends",
    "image": defaultImage,
    "@id": "https://sumathitrends.com",
    "url": "https://sumathitrends.com",
    "telephone": "+91XXXXXXXXXX", // Replace with actual if available
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kodigehalli",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560092",
      "addressCountry": "IN"
    },
    "description": "Premium kids clothing store in Bangalore, Karnataka for children aged 0-12 years. Best ethnic and party wear.",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "10:00",
      "closes": "21:00"
    }
  };

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
