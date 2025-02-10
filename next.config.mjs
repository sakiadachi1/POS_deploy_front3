const nextConfig = {
  output: 'standalone',  // ✅ 追加
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://tech0-gen8-step4-pos-app-34.azurewebsites.net",
  },
};

export default nextConfig;
