/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  eslint: {
    // Linting is run separately; keep production builds deterministic.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
