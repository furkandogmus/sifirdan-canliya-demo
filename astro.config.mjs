import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // S3 + CloudFront alt klasörde index.html aramaz: /bolum.html biçiminde üretiyoruz.
  build: { format: "file" },
  trailingSlash: "never",
  vite: { plugins: [tailwindcss()] },
});
