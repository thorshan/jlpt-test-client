import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
}

const SITE_NAME = "JLPTX";
const DEFAULT_DESCRIPTION = "Free Japanese Language Proficiency Test (JLPT) mock exams. Practice N1, N2, N3, N4, and N5 levels with real-time feedback and results.";
const SITE_URL = "https://jlptx.com"; // User mentioned adding .com later, using placeholder for now.
const DEFAULT_OG_IMAGE = "/JLPTX.png";

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  twitterHandle = "@JLPTX",
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const image = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={twitterHandle} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": SITE_NAME,
          "url": SITE_URL,
          "description": DEFAULT_DESCRIPTION,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${SITE_URL}/test?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
