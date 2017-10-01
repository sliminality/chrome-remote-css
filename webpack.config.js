const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const baseConfig = {
  context: path.resolve(__dirname),
  entry: './src/background.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'background.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Background Page',
      filename: 'background.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  target: 'web',
  devtool: 'source-map',
};

const devConfig = {
  devtool: 'inline-source-map',
  plugins: [new ChromeExtensionReloader()],
  watch: true,
};

module.exports = function(env) {
  return env.dev ? Object.assign(baseConfig, devConfig) : baseConfig;
};
