// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
  webpack: {
    alias: {
      '@': resolve('src'),
    },
    // configure: webpackConfig => {
    //   webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    //   return webpackConfig;
    // },
  },
};
