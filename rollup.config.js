import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'dist/src/index.js',
  output: {
    file: 'index.js',
    format: 'cjs',
    strict: false,
    banner: '#! /usr/bin/env node\n',
    preferConst: true,
  },
  plugins: [resolve(), json(), commonjs()],
  external: ['child_process', 'fs', 'path', 'os', 'https', 'readline', 'zlib', 'events', 'stream', 'util', 'buffer'],
};
