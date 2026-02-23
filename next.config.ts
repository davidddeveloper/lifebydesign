import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
