const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portfinder = require('portfinder');
const opn = require('opn');
const getClientEnvironment = require('./env');
const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../config/index');
const utils = require('./utils');
// 初始化 thread-loader 的配置
utils.cache().init();
// utils.writeConfigFileSync()
process.env.NODE_ENV = 'development';

const { HOST } = process.env;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  // 开发环境下默认启用cache，在内存中对已经构建的部分进行缓存
  // 避免其他模块修改，但是该模块未修改时候，重新构建，能够更快的进行增量构建
  // 属于空间换时间的做法
  cache: false,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'info',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: config.dev.assetsPublicPath,
        },
      ],
    },
    // historyApiFallback: true,
    noInfo: true,
    hot: true,
    // disableHostCheck: true, //  新增该配置项
    contentBase: false, // since we use CopyWebpackPlugin.
    // contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: HOST || config.dev.host || '0.0.0.0',
    port: PORT || config.dev.port,
    // open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: true, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: false, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    disableHostCheck: true,
  },
  optimization: {
    noEmitOnErrors: true,
    namedModules: true, // 取代插件中的 new webpack.NamedModulesPlugin()
    namedChunks: true,
  },
  plugins: [
    // new HardSourceWebpackPlugin(),
    new webpack.DefinePlugin(getClientEnvironment().stringified),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      inject: true,
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  // 在webpack中加载.env.xxx中环境变量
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;
      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`,
            ],
          },
        }),
      );
      if (config.dev.autoOpenBrowser) {
        opn(`http://${devWebpackConfig.devServer.host}:${port}`);
      }
      resolve(devWebpackConfig);
    }
  });
});
