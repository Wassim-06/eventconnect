// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co', 'i.pravatar.cc', 'unsplash.com'], // ← ajoute tous les domaines externes que tu utilises !
  },
};

module.exports = nextConfig;