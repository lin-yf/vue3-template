const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const safeParser = require('postcss-safe-parser')
const getClientEnvironment = require("./env");

const getUglify = () => {
  return new TerserPlugin({
    terserOptions: {
      parse: {
        ecma: 8
      },
      compress: {
        ecma: 5,
        // 删除所有的 `console` 语句
        drop_console: true,
        warnings: false,
        comparisons: false,
        inline: 2
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      }
    },
    // Use multi-process parallel running to improve the build speed
    // Default number of concurrent runs: os.cpus().length - 1
    parallel: true,
    // Enable file caching
    cache: true,
    sourceMap: config.build.productionSourceMap
  })
}
var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:12].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash:12].js')
  },
  optimization: {
    minimizer: [
      getUglify(),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: config.build.productionSourceMap ? { parser: safeParser, map: { inline: false } } : { parser: safeParser }
      })
    ], // 是否进行代码压缩
    splitChunks: {
      chunks: 'async',
      minSize: 30000, // 模块大于30k会被抽离到公共模块
      minChunks: 3, // 模块出现1次就会被抽离到公共模块
      maxAsyncRequests: 5, // 异步模块，一次最多只能被加载5个
      maxInitialRequests: 3, // 入口模块最多只能加载3个
      name: true,
      cacheGroups: {
        vendors: {
          test(file) {
            return file.resource && /\.js$/.test(file.resource) && file.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
          },
          name: 'vendor',
          chunks: 'all',
          minChunks: 2,
          priority: -10,
          enforce: true,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 3,
          priority: 10,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin(getClientEnvironment().stringified),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[hash:5].css'),
      // chunkFilename: utils.assetsPath('css/[name].[chunkhash:5].css'),
      // filename: utils.assetsPath('css/style.css'),
    }),

    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'public/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    }),
    new ScriptExtHtmlWebpackPlugin({
      // sync: 'important',
      defaultAttribute: 'defer'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
})
if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
