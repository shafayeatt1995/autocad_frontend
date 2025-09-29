// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: { BASE_URL: process.env.BASE_URL, API_URL: process.env.API_URL },
  },

  modules: ["@nuxtjs/tailwindcss"],
});