import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import metablock from 'rollup-plugin-userscript-metablock';

import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string';

const production = !process.env.ROLLUP_WATCH && !process.env.DEVELOPMENT;
const watch = process.env.ROLLUP_WATCH;
const development = process.env.DEVELOPMENT;

function css(options = {}) {
	const filter = createFilter(options.include || ['**/*.css'], options.exclude);

	return {
		name: 'css',
		transform(code, id) {
			if (!filter(id)) {
				return
			}
			return {
				code: 'registerCSS(' + JSON.stringify(code) + ');',
				map: { mappings: '' }
			}
		},
	}
}

function wrap ( options ) {
  return {
    name: 'wrap',
    renderChunk(code, renderedChunk, outputOptions) {
      const magicString = new MagicString( code )
        .prepend( options.intro )
        .append( options.outro );
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true })
      };
    },
  };
}

const iitcWrapperHeader = `
function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

var cssList = [];
function registerCSS(css) {
	cssList.push(css);
}

function addCSS(css) {
	var s = document.createElement('style');
	s.textContent = css;
	document.head.appendChild(s);
}

function addCSSs(css) {
	cssList.forEach(addCSS);
}
`;

const iitcWrapperFooter = `
setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
`;

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'setup',
		file: 'dist/dataExplorer.user.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		css(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		wrap({
			include: ["**/*.js"],
			intro: iitcWrapperHeader,
			outro: iitcWrapperFooter,
		}),

		metablock({
			file: "./meta.json"
		}),
	],
	watch: {
		clearScreen: false
	}
};
