// webpack.config.js
const path = require('path');

module.exports = {
  entry: './routes/auth2.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};
