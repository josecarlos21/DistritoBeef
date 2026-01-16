import React, { useEffect } from 'react';

interface MetaHeadProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const SITE_TITLE = 'Distrito Vallarta';
const DEFAULT_DESC = 'La guía definitiva para osos y admiradores en Puerto Vallarta. Eventos, mapas y comunidad.';
const DEFAULT_IMAGE = '/pwa-512x512.png'; // Assuming this exists or using a placeholder

export const MetaHead: React.FC<MetaHeadProps> = ({
    title,
    description = DEFAULT_DESC,
    image = DEFAULT_IMAGE,
    url = window.location.href
}) => {
    useEffect(() => {
        // Title
        document.title = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;

        // Meta Tags Helper
        const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
            let element = document.querySelector(`meta[${attr}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard
        setMeta('description', description);

        // Open Graph
        setMeta('og:title', title ? `${title} | ${SITE_TITLE}` : SITE_TITLE, 'property');
        setMeta('og:description', description, 'property');
        setMeta('og:image', image, 'property');
        setMeta('og:url', url, 'property');
        setMeta('og:type', 'website', 'property');

        // Twitter
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', title ? `${title} | ${SITE_TITLE}` : SITE_TITLE);
        setMeta('twitter:description', description);
        setMeta('twitter:image', image);

    }, [title, description, image, url]);

    return null; // Head management only
};
