// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
  webpack: {
    alias: {
      '@': resolve('src'),
    },
  },
};
