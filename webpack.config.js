const path = require('path');

module.exports = {
  entry: './node_client.js',
  output: {
    filename: 'test.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8081,
  }
};