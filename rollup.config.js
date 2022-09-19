import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
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
      sourcemap: !production && 'inline',
      format: 'es',
      file: 'build/plugin.js',
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
      commonjs(),
      
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
  },
  // build the plugin from the default export
  {
    input: 'build/plugin.js',
    output: {
      file: 'dist/dataExplorer.user.js',
      globals: {
        info: 'info',
      }
    },
    plugins: [
      iitcplugin({
        id: 'dataExplorer',
        meta: metaJson,
        downloadRoot: 'https://github.com/le-jeu/iitc-data-explorer/raw/dist/',
        noWrapper: false,
        buildName: 'lejeu',
      }),
    ],
  },
];
