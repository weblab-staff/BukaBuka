const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootWebpackConfig = require('../../webpack.config');
const entryFile = require.resolve('./src/client-main.tsx');
/** @type import('webpack').Configuration */
module.exports = {
  ...rootWebpackConfig,
  entry: ["@babel/polyfill", entryFile],
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [...rootWebpackConfig.plugins, new HtmlWebpackPlugin({ title: 'buka buka', favicon: path.join(__dirname, 'src/images/favicon.ico') })],
};
