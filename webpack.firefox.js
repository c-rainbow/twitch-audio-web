const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require("copy-webpack-plugin");

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'dist/[name].js',
    path: path.resolve(__dirname, 'release-firefox'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.firefox.json", to: "manifest.json" },
        { from: "_locales", to: "_locales" },
        { from: ".webstore", to: ".webstore" },
        { from: "css", to: "css" },
        { from: "icons", to: "icons" },
        { from: "popup", to: "popup" },
      ],
    }),
  ],
});