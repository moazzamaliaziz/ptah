import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 note: verified against node_modules/next/dist/docs/01-app/
  // 03-api-reference/05-config — all of these remain valid top-level options.
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Phase 7 media library: the upload Server Action receives image FormData.
    // Default cap is 1 MB; the app-layer validator enforces 8 MB raster / 512 KB
    // SVG, so 10mb here leaves headroom for multipart boundary/header overhead.
    // The widened surface is mitigated by the `media.manage` capability gate —
    // only staff can reach the action (verified against 05-config/serverActions.md).
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // design.md §8.2 — verbatim optimizer ladder (all <Image> srcsets).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // qualities defaults to [75] on Next 16 — keep the reference q=75.
    // Local imagery: the design image library (ptah-tours/images, WebP) is
    // copied into /public/assets/** by a later phase and served same-origin —
    // no remotePatterns entry needed for it.
    //
    // Next 16 gotchas honored here:
    //  • images.domains is deprecated → use remotePatterns only.
    //  • Local images with QUERY STRINGS need images.localPatterns (add when
    //    we start fingerprinting asset URLs).
    //  • Default minimumCacheTTL is 4h; qualities defaults to [75].
    remotePatterns: [
      {
        // TEMPORARY: placeholder imagery used by the pre-Phase-0 marketing
        // pages. Remove once /public/assets photography lands.
        protocol: "https",
        hostname: "picsum.photos",
      },
      // FUTURE CDN: add the media/CDN hostname here when assets move off the
      // app server, e.g. { protocol: "https", hostname: "media.example.com" }.
    ],
  },
};

export default nextConfig;