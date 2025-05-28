module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/, // Transpile les fichiers .js et .mjs
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};