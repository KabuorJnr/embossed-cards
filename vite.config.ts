import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'node:path';
import business from './src/config/business.json';

/**
 * Injects the published business details into every HTML page.
 * Edit src/config/business.json and every page updates on the next build.
 */
function businessDetails(): Plugin {
  return {
    name: 'business-details',
    transformIndexHtml(html) {
      return html.replace(/%%(\w+)%%/g, (match, key: string) =>
        key in business ? String(business[key as keyof typeof business]) : match,
      );
    },
  };
}

const page = (p: string) => resolve(__dirname, p);

export default defineConfig({
  // Relative base so the build works on GitHub Pages, Vercel or any static host.
  base: './',
  plugins: [businessDetails()],
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        main: page('index.html'),
        open: page('open.html'),
        privacy: page('legal/privacy.html'),
        terms: page('legal/terms.html'),
        refunds: page('legal/refunds.html'),
        cookies: page('legal/cookies.html'),
        about: page('legal/about.html'),
        deleteData: page('legal/delete-data.html'),
        accessibility: page('legal/accessibility.html'),
      },
    },
  },
});
