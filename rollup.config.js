import typescript from '@rollup/plugin-typescript';

const isProd = process.env.NODE_ENV === 'production';
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: isProd ? 'es' : 'cjs',
    sourcemap: !isProd,
    exports: 'auto',
  },
  external: ['acorn'],
  plugins: [
    typescript({
      target: isProd ? 'es5' : 'es6',
      tsconfig: isProd ? 'tsconfig-build.json' : 'tsconfig.json',
    }),
  ],
};
