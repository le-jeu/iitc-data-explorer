import MagicString from 'magic-string';

const wrapper = {
  header: "function wrapper() {\n",
  footer:
    "\n}\n",
};

const injection = `
var script = document.createElement('script');
// if on last IITC mobile, will be replaced by wrapper(info)
var mobile = \`script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);\`;
// detect if mobile
if (mobile.startsWith('script')) {
  script.appendChild(document.createTextNode('('+ wrapper +')();'));
  script.appendChild(document.createTextNode('//# sourceURL=iitc:///plugins/@plugin_id@.js'));
  (document.body || document.head || document.documentElement).appendChild(script);
} else {
  // mobile string
  wrapper();
}
`;

export default function metablock(options = {}) {
  const pluginId = options.id;
  const baseConf = {
    author: "anonymous",
    name: "New plugin",
    category: "Misc",
    version: "0.1.0",
    description: "custom plugin",
    id: pluginId,
    namespace: "https://github.com/IITC-CE/ingress-intel-total-conversion",
    updateURL: false,
    downloadURL: false,
    match: "https://intel.ingress.com/*",
    grant: "none",
  };

  if (options.meta) {
    Object.keys(options.meta).forEach((key) => {
      if (key in baseConf) baseConf[key] = options.meta[key];
    });
  }

  const buildDate = new Date().toISOString();
  if (options.timestamp) {
    baseConf.version += "-" + buildDate.replace(/[-:]/g, "").slice(0, 15);
  }

  if (!options.withoutNamePrefix)
    baseConf.name = "IITC plugin: " + baseConf.name;

  if (options.downloadRoot) {
    if (options.downloadRoot.slice(-1) !== "/") options.downloadRoot += "/";
    baseConf.downloadURL = options.downloadRoot + pluginId + ".user.js";
    baseConf.updateURL =
      options.downloadRoot +
      pluginId +
      (options.updateMeta ? ".meta.js" : ".user.js");
  }

  const lines = [];
  lines.push("// ==UserScript==");
  for (const key in baseConf) {
    if (baseConf[key]) {
      lines.push(`// @${key.padEnd(13, " ")} ${baseConf[key]}`);
    }
  }
  lines.push("// ==/UserScript==");

  const header = lines.join("\n");
  const useMeta = options.updateMeta;

  return {
    generateBundle(options, bundle) {
      if (useMeta)
        this.emitFile({
          type: "asset",
          fileName: pluginId + ".meta.js",
          source: header,
        });
      if (options.sourcemap) {
        for (const id in bundle) {
          const chunk = bundle[id];
          chunk.code = chunk.code.replace("'//# sourceURL=iitc:///plugins/@plugin_id@.js'", `'//# sourceMappingURL=${chunk.map.toUrl()}'`);
        }
      } else {
        for (const id in bundle) {
          const chunk = bundle[id];
          chunk.code = chunk.code.replace("'//# sourceURL=iitc:///plugins/@plugin_id@.js'", `'//# sourceURL=iitc:///plugins/${pluginId}.js'`);
        }
      }
    },
    renderChunk(code, info, options) {
      if (info.isEntry) {
        const name = options.name;
        const magicString = new MagicString(code);
        magicString.append(`
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(${name});
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof ${name} === 'function') ${name}();
${name}.info = { 
  script: { 
    version: ${JSON.stringify(baseConf.version)}, 
    name: ${JSON.stringify(baseConf.name)}, 
    description: ${JSON.stringify(baseConf.description)} 
  }
};`);
        // Wrapper
        magicString.prepend(wrapper.header);
        magicString.append(wrapper.footer);

        let map;
        if (options.sourcemap !== false) {
          const injectionMagicString = magicString.clone();
          injectionMagicString.prepend("(");
          injectionMagicString.append(")();");
          map = injectionMagicString.generateMap({ hires: true });
        }
        magicString.append(injection);

        // Headers
        magicString.prepend(header + "\n");

        const result = { code: magicString.toString() }
        if (options.sourcemap !== false) {
          result.map = map;
        }
        return result
      }
    },
  };
}
