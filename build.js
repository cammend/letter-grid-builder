import { build } from "esbuild";

const entryFile = "src/index.ts";
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  // Treat all dependencies in package.json as externals to keep bundle size to a minimum
  logLevel: "info",
  minify: true,
  sourcemap: true,
};

build({
  ...shared,
  format: "esm",
  outfile: "./dist/index.esm.js",
  target: ["esnext", "node12.22.0"],
});

build({
  ...shared,
  format: "cjs",
  outfile: "./dist/index.cjs.js",
  target: ["esnext", "node12.22.0"],
});