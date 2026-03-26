// astro.config.mjs
import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import vercel from "@astrojs/vercel/serverless"

export default defineConfig({
  output: "static",
  adapter: vercel(),

  vite: {
    plugins: [
      tailwindcss(), // your existing Tailwind setup
    ],
  },
})
