import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'dist/src/createStencilApp.js',
  output: {
    file: 'dist/createStencilApp.js',
    format: 'cjs',
  },
  plugins: [resolve(), commonjs()]
};