const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.ts'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].[hash:12].js',
    chunkFilename: '[name].[chunkhash:12].chunk.js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.ts','.tsx','.js','.jsx', '.vue', '.json'],
    alias: {
      'vue': '@vue/runtime-dom',
      '@': resolve('src'),
    }
  },
  externals: {
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../public"),
        to: config.dev.assetsSubDirectory,
        ignore: [".*"]
      }
    ])
  ],
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      // {
      //   test: /\.tsx?$/,
      //   use: [
      //     ...utils.cache().getLoaders('cache-babel'),
      //     'babel-loader?cacheDirectory=true'
      //   ],
      //   include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
      //   exclude: /node_modules/
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: utils.assetsPath(process.env.NODE_ENV === 'production' ? 'img/[name].[hash:4].[ext]' : 'img/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: utils.assetsPath(process.env.NODE_ENV === 'production' ? 'fonts/[name].[hash:4].[ext]' : 'img/[name].[ext]')
        }
      },
      {
        test: /workers\/webWorker(\.js)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: utils.assetsPath(process.env.NODE_ENV === 'production' ? 'fonts/[name].[hash:4].[ext]' : 'img/[name].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
