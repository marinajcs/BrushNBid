const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './static/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
    hot: true,
    watchFiles: ['src/**/*'],
    proxy: [
      {
        context: ['/api'], // Ruta que debe redirigirse al backend
        target: 'http://localhost:3000', // URL del servidor backend
        changeOrigin: true,
      },
    ],
  },
};
