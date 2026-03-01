// @ts-check
// This is an AstroDB via Turso, deployment ready via adapter-node Astro scaffold.
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import db from "@astrojs/db";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [db()],
  output: 'server',
  adapter: node({
    mode: "standalone"
  })
});