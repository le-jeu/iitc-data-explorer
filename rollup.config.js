import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

import iitcplugin from './rollup-plugin-iitcplugin';
import metaJson from './meta.json';

const production = !process.env.ROLLUP_WATCH && !process.env.DEVELOPMENT;

export default [
  {
    input: 'src/main.ts',
    output: {
      sourcemap: !production && 'hidden',
      format: 'iife',
      file: 'dist/dataExplorer.user.js',
      name: 'setup',
      sourcemapPathTransform: (file) => {
        return `iitc:///plugins/dataExplorer/${file.slice(3)}`;
      },
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
        },
        emitCss: false,
      }),

      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),

      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),

      iitcplugin({
        id: 'dataExplorer',
        meta: metaJson,
        downloadRoot: 'https://github.com/le-jeu/iitc-data-explorer/raw/dist/',
        buildName: 'lejeu',
      }),
    ],
  },
];
