const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // ... other configuration options ...
  plugins: [
    new NodePolyfillPlugin()
  ]
};