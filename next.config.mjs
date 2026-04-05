/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow HMR / dev assets when opening the app via LAN IP (e.g. phone or another device).
  // Add more hostnames here if your "Network" URL in the terminal changes.
  allowedDevOrigins: ["172.30.32.1"],
};

export default nextConfig;
