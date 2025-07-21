/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    // Handle Remotion dependencies
    if (isServer) {
      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        esbuild: "commonjs esbuild",
      });
    } else {
      // For client-side, mark esbuild as external
      config.externals.push({
        esbuild: "esbuild",
      });
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default config;
