import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  {
    input: './library/main.ts',
    output: {
      file: pkg.main,
      format: 'es',
      exports: 'named',
    },

    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfigOverride: {
          include: ['./library'],
          compilerOptions: {
            outDir: './dist',
          },
        },
      }),
    ],
  },
  {
    input: './library/animations/main.ts',
    output: {
      file: './dist/animations/main.js',
      format: 'es',
      exports: 'named',
    },

    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfigOverride: {
          include: ['./library/animations'],
          compilerOptions: {
            outDir: './dist/animations',
            declaration: false,
          },
        },
      }),
    ],
  },
];
