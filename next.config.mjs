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
        destination: "/resume.pdf", // The external site
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // fileLoaderRule.exclude = /\.svg$/i;
    config.module.rules.push({
      test: /\.(glsl|vs|fs|frag|vert)$/, // Match GLSL files
      use: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;
