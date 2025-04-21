import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: isProd ? "/data-structure-visualization/" : "",
  basePath: isProd ? "/data-structure-visualization" : "",
};

export default nextConfig;
