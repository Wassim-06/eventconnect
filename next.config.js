// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co', 'i.pravatar.cc', 'unsplash.com'], // ← ajoute tous les domaines externes que tu utilises !
  },
  webpack(config) {
    // Ne pas suivre les symlinks lors de la résolution de modules
    config.resolve.symlinks = false;
    return config;
  },
};

module.exports = nextConfig;