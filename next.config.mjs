/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/resume", // Define your own path
        destination: "https://standardresume.co/r/minka", // The external site
      },
    ];
  },
};
export default nextConfig;
