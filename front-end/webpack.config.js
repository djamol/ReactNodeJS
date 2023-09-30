const path = require('path');


module.exports = {
  // ...other webpack configuration options...
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  },  
  module: {
    rules: [
      // ...other rules...
{
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // Add the html-loader rule
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
};
