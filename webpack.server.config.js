const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/server.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  stats: {
    errorDetails: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'pg-native': false
    }
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
