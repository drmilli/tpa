import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: object;
}

const BASE_URL = 'https://thepeoplesaffairs.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'The Peoples Affairs';

export default function SEO({
  title,
  description = 'Track Nigerian politicians, view performance rankings, participate in polls, and stay informed about Nigerian politics. Transparent political intelligence for informed citizens.',
  keywords = 'Nigerian politics, politicians, Nigeria elections, INEC, APC, PDP, LP, governors, senators, political rankings',
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Nigerian Political Data Platform`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific */}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Helper function to generate Person structured data for politicians
export function generatePoliticianStructuredData(politician: {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  biography?: string | null;
  partyAffiliation: string;
  state?: { name: string } | null;
  office?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${politician.firstName} ${politician.lastName}`,
    image: politician.photoUrl || undefined,
    description: politician.biography || undefined,
    affiliation: {
      '@type': 'PoliticalParty',
      name: politician.partyAffiliation,
    },
    jobTitle: politician.office || 'Politician',
    workLocation: politician.state ? {
      '@type': 'Place',
      name: `${politician.state.name}, Nigeria`,
    } : {
      '@type': 'Country',
      name: 'Nigeria',
    },
  };
}

// Helper function to generate BreadcrumbList structured data
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Helper function to generate FAQPage structured data
export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
