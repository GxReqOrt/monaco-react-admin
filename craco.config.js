const { whenDev } = require('@craco/craco');
const CopyPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new MonacoWebpackPlugin({ languages: [] }),
        new CopyPlugin({
          patterns: [
            {
              from: 'node_modules/vscode-oniguruma/release/onig.wasm',
              to: 'onig.wasm',
            },
          ],
        }),
      ],
    },
    configure: (webpackConfig) =>
      merge(webpackConfig, {
        module: {
          rules: [
            {
              test: /\.wasm$/,
              use: ['wasm-loader'],
            },
          ],
        },
      }),
  },
};
