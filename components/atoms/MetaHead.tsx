import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const SITE_TITLE = 'District Vallarta'; // Updated to English/International name
const DEFAULT_DESC = 'The ultimate guide for bears and admirers in Puerto Vallarta. Events, maps, and community.';
const DEFAULT_IMAGE = 'https://districtvallarta.com/og-image.jpg'; // Needs absolute URL for sharing

export const MetaHead: React.FC<MetaHeadProps> = ({
    title,
    description = DEFAULT_DESC,
    image = DEFAULT_IMAGE,
    url = typeof window !== 'undefined' ? window.location.href : 'https://districtvallarta.com'
}) => {
    const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;

    return (
        <Helmet>
            {/* Standard */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_TITLE} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};
