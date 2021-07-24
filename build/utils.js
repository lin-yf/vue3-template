const path = require('path')
const config = require('../config/index')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const threadLoader = require('thread-loader')
const packageConfig = require('../package.json')
const fs = require('fs')

exports.getThemeConfig = function() {
  // const lessToJs = require('less-vars-to-js') // 也可以借助第三方包
  // const themer = lessToJs(fs.readFileSync(path.join(__dirname, './theme.less'), 'utf8'))
  const pkgPath = path.join(__dirname, '../package.json')
  const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {}
  let theme = {}
  if (pkg.theme && typeof pkg.theme === 'string') {
    let cfgPath = pkg.theme
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(__dirname, '..', cfgPath)
    }
    const config = require(cfgPath)
    theme = config
  } else if (pkg.theme && typeof pkg.theme === 'object') {
    theme = pkg.theme
  }
  return theme
}

exports.assetsPath = function(_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders)
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', { javascriptEnabled: true, modifyVars: exports.getThemeConfig() }),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

// 路径处理函数
const resolve = dir => path.resolve(__dirname, '../', dir)

// 缓存配置，优化打包速度
exports.cache = () => {
  const init = () => {
    // thread-loader 初始化设置
    threadLoader.warmup(
      {
        workers: 2,
        workerParallelJobs: 50,
        workerNodeArgs: ['--max-old-space-size=1024'],
        poolRespawn: false,
        poolTimeout: 500,
        poolParallelJobs: 200
      },
      ['babel-loader', 'vue-loader']
    )
  }
  // cache-loader 配置
  const getLoaders = dir => [
    {
      loader: 'cache-loader',
      options: {
        cacheDirectory: resolve(`.cache/${dir}`)
      }
    },
    'thread-loader'
  ]
  return {
    init,
    getLoaders
  }
}
