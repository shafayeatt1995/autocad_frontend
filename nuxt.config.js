export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: { BASE_URL: process.env.BASE_URL, API_URL: process.env.API_URL },
  },

  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  pwa: {
    registerType: "autoUpdate",
    strategies: "generateSW",
    includeAssets: ["logo.png"],
    manifest: {
      name: "Bappy",
      short_name: "Bappy",
      description: "Bappy",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      icons: [
        {
          src: "/logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
});
