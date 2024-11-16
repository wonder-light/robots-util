// rollup.config.js
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig, InputPluginOption } from 'rollup';
import { dts } from 'rollup-plugin-dts';

// fileURLToPath(new URL('src/some-file.js', import.meta.url))

const pluginsLocal: InputPluginOption = [
  nodeResolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled'
  }),
];

export default defineConfig([
  {
    input: './lib/index.ts',
    output: {
      dir: './dist/cjs',
      name: 'index.js',
      // file: 'dist/index.cjs',
      format: 'cjs',
      plugins: []
    },
    plugins: [
      ...pluginsLocal,
      typescript(),
    ]
  },
  {
    input: './lib/index.ts',
    output: {
      dir: './dist/esm',
      name: 'index.js',
      // file: 'dist/index.mjs',
      format: 'esm',
      // preserveModules: false, // 保留模块结构
      // preserveModulesRoot: 'src', // 将保留的模块放在根级别的此路径下
      plugins: []
    },
    plugins: [
      ...pluginsLocal,
      typescript({
        tsconfig: './tsconfig.esm.json',
      })
    ]
  },
  /* 单独生成声明文件 */
  {
    input: './lib/index.ts',
    output: {
      dir: './dist/types',
      name: 'index.d.ts',
      format: 'esm',
    },
    plugins: [
      dts(),
    ],
  },
]);
