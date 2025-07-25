/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";
const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA({
  images: {
    remotePatterns: [
      {
        hostname: "books.google.com",
        protocol: "https",
        port: "",
      },
    ],
  },
});
