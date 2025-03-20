/** @type {import('next').NextConfig} */
const nextConfig = {
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
