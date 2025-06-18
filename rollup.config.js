import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const format = process.env.FORMAT || 'esm';

const config = {
  input: 'src/index.ts',
  output: {
    format,
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.source.json',
      sourceMap: true,
      inlineSources: true,
      declaration: false,
    }),
  ],
};

if (format === 'esm') {
  config.output.file = 'dist/esm/index.js';
} else if (format === 'cjs') {
  config.output.file = 'dist/cjs/index.js';
}

export default config;
