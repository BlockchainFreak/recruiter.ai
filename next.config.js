/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      },
    ],
  }
}

module.exports = nextConfig
