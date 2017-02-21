const path = require('path');

module.exports = {
  // Set entry file
  entry: {
    main: './src/lib/js/index.js'
  },
  // set output JS file
  output: {
    filename: 'main.js',
    path: path.join(__dirname, '/public/js')
  },

  module: {
    loaders: [
      // Processes Javascript from webpack-build.js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader' // & transpile
      }
    ]
  }
};
