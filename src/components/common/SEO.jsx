// \portfolio-showcase\src\components\common\SEO.jsx

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  path = '/',
  title = 'Default Title',
  description = 'Default Description',
  keywords = 'IT, Development, Portfolio, React',
  author = 'Angel Guevara',
  image = '',
  siteName = 'Synergy Code Labs',
}) => {
  // If you have a domain, you can assemble a canonical URL
  const siteUrl = 'https://synergycodelabs.github.io'; // or your custom domain
  const canonicalUrl = `${siteUrl}${path}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;