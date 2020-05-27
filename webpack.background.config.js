const path = require('path');

module.exports = {
  entry: ['./src/background/background.ts'],
  devtool: 'inline-source-map',
  output: {
    filename: 'background_combined.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
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