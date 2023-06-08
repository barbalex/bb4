import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'
import { qwikCity } from '@builder.io/qwik-city/vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
      VitePWA({
        workbox: {
          sourcemap: true,
          globPatterns: [
            '**/*.{js,jsx,ts,tsx,css,html,ico,png,svg,webp,json,woff2,woff}',
          ],
          maximumFileSizeToCacheInBytes: 1000000000,
        },
        registerType: 'autoUpdate',
        includeAssets: [],
        // https://developer.mozilla.org/en-US/docs/Web/Manifest
        manifest: {
          name: 'mediterranean-migration.com',
          short_name: 'Mediterranean Migration',
          description:
            'Overview over migration across the the blue borders of the Me­diterrane­an',
          background_color: '#222222',
          theme_color: '#222222',
          display: 'minimal-ui',
          icons: [],
          categories: [
            'migration',
            'political-science',
            'refugees',
            'mediterranean',
          ],
          screenshots: [],
          orientation: 'portrait',
        },
        devOptions: {
          //enabled: true,
        },
      }),
    ],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  }
})
