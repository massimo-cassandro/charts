import node_resolve from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.js',
  plugins: [
    node_resolve(),
    // commonjs(),
    // terser({ compress: { passes: 2 } }),
  ],
  output: [
    {
      file: './demo/browser-demo/charts-demo.js',
      name: 'charts',
      format: 'es',
      sourcemap: true
    }
  ]
};

