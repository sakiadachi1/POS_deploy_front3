/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://tech0-gen8-step4-pos-app-34.azurewebsites.net",
  },
  //output: "standalone",
};

export default nextConfig;
