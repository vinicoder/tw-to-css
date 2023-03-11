import { readdir, readFile } from "fs/promises";
import { parse } from "path";
import { fileURLToPath } from "url";
import { build, BuildOptions } from "esbuild";

const buildConfig: BuildOptions = {
  define: {
    "process.env.DEBUG": "undefined",
    "process.env.JEST_WORKER_ID": "1",
    "process.env.ENGINE": "stable",
    "process.env.OXIDE": "undefined",
    __dirname: '"/"',
  },
  supported: {
    "nullish-coalescing": false,
    "optional-chain": false,
  },
  external: ["svgo"],
  plugins: [
    {
      name: "alias",
      async setup({ onLoad, onResolve, resolve }) {
        const stubFiles = await readdir("src/stubs", { withFileTypes: true });
        const stubNames = stubFiles
          .filter((file) => file.isFile())
          .map((file) => parse(file.name).name);

        onResolve({ filter: new RegExp(`^(${stubNames.join("|")})$`) }, ({ path }) => ({
          path: fileURLToPath(new URL(`stubs/${path}.ts`, import.meta.url)),
          sideEffects: false,
        }));

        onResolve({ filter: /^@tailwindcss\/oxide/ }, ({ path }) => ({
          path: fileURLToPath(new URL(`stubs/${path}.ts`, import.meta.url)),
          sideEffects: false,
        }));

        onResolve({ filter: /^tailwindcss$/ }, ({ path, ...options }) =>
          resolve("tailwindcss/src", options)
        );

        onResolve({ filter: /^tailwindcss\/lib/ }, ({ path, ...options }) =>
          resolve(path.replace("lib", "src"), options)
        );

        onResolve({ filter: /^\.+\/(util\/)?log$/, namespace: "file" }, ({ path, ...options }) => {
          if (options.importer.includes("tailwindcss")) {
            return {
              path: fileURLToPath(new URL("stubs/tailwindcss/utils/log.ts", import.meta.url)),
              sideEffects: false,
            };
          }
          return resolve(path, {
            ...options,
            namespace: "noRecurse",
          });
        });

        onResolve({ filter: /^postcss-selector-parser\/.*\/\w+$/ }, ({ path, ...options }) =>
          resolve(`${path}.js`, options)
        );

        onLoad({ filter: /tailwindcss\/src\/css\/preflight\.css$/ }, async ({ path }) => {
          const result = await build({
            entryPoints: [path],
            minify: true,
            logLevel: "silent",
            write: false,
          });
          return { contents: result.outputFiles[0].text, loader: "text" };
        });

        onLoad({ filter: /\/tailwindcss\/stubs\/defaultConfig\.stub\.js$/ }, async ({ path }) => {
          const cjs = await readFile(path, "utf8");
          const esm = cjs.replace("module.exports =", "export default");
          return { contents: esm };
        });
      },
    },
  ],
};

// COMMONJS
build({
  entryPoints: { index: "src/builds/module.ts" },
  bundle: true,
  minify: true,
  logLevel: "info",
  outdir: "dist",
  format: "cjs",
  ...buildConfig,
});

// MODULE
build({
  entryPoints: { "index.mjs": "src/builds/module.ts" },
  bundle: true,
  minify: true,
  logLevel: "info",
  outdir: "dist",
  format: "esm",
  ...buildConfig,
});

// CDN
build({
  entryPoints: { "cdn.min": "src/builds/cdn.ts" },
  bundle: true,
  minify: true,
  logLevel: "info",
  outdir: "dist",
  format: "iife",
  ...buildConfig,
});
