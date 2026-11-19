import { staticAdapter } from '@builder.io/qwik-city/adapters/static/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import baseConfig from '../../vite.config';

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.ssr.tsx', '@qwik-city-plan'],
      },
    },
    plugins: [
      staticAdapter({
        // canonical origin used to render absolute urls during static generation
        origin: 'https://blue-borders.ch',
      }),
    ],
  };
});
