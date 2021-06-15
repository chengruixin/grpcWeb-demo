const path = require('path');

module.exports = {
  entry: './client.js',
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8081,
  },
  mode : "development"
};