const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require("copy-webpack-plugin");

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'dist/[name].js',
    path: path.resolve(__dirname, 'release'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "_locales", to: "_locales" },
        { from: ".webstore", to: ".webstore" },
        { from: "css", to: "css" },
        { from: "icons", to: "icons" },
        { from: "popup", to: "popup" },
      ],
    }),
  ],
});