const path = require('path');

module.exports = {
  entry: ['./src/index.ts'],
  devtool: 'inline-source-map',
  output: {
    filename: 'contentscript_combined.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  externals: {
    hlsjs: 'hls.js'
  },
  module: {
      /*noParse: /hls.js|chrome/,*/
      rules: [
          {
              test: /\.css$/,
              use: [
                  'style-loader',
                  'css-loader',
              ]
          },
          {
              test: /\.(png|svg|jpg|gif)/,
              use: [
                  'file-loader',
              ]
          },
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          }
      ]
  },
  optimization: {
      minimize: false
  }
};