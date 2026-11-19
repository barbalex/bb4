import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { qwikCity } from '@builder.io/qwik-city/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), qwikCity(), qwikVite(), tsconfigPaths()],
    server: {
      // dedicated port so this dev server coexists with other local projects;
      // other dev servers here restart often and auto-increment through the
      // 5173+ range, so stay well outside it. strictPort fails loudly instead
      // of silently hopping to the next free port
      port: 6262,
      strictPort: true,
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  }
})
