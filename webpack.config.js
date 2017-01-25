const path = require('path');

module.exports = {
  context: __dirname,
  entry: './lib/decomposition.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-map',
};
