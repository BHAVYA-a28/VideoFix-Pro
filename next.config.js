/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Useful for static exports or desktop wrappers
  },
};

export default nextConfig;
