import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pensy.pk',
      },
      {
        protocol: 'https',
        hostname: '**.pensy.pk',
      },
      {
        protocol: 'http',
        hostname: 'pensy.pk',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
    ],
  },
  // NOTE: Do NOT add @tailwindcss/turbopack as a manual loader rule here.
  // Tailwind v4 integrates with Turbopack automatically via the
  // @import "tailwindcss" directive in globals.css. The @tailwindcss/turbopack
  // package is only required as a devDependency — Turbopack picks it up
  // automatically based on the CSS import, not via manual loader rules.
  // Prevent Windows OneDrive worker lock collisions during static page export
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;

