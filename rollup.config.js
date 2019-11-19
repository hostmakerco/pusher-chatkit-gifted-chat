import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import sourceMaps from 'rollup-plugin-sourcemaps';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import json from 'rollup-plugin-json';
import visualiser from 'rollup-plugin-visualizer';
import svgr from '@svgr/rollup';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      name: 'pusher-chatkit-gifted-chat',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      name: 'pusher-chatkit-gifted-chat',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    json(),
    postcss({
      modules: true,
    }),
    url(),
    svgr(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: true,
          inlineSourceMap: false,
          module: 'ES2015',
        },
      },
    }),
    commonjs(),
    sourceMaps(),
    visualiser(),
  ],
};
