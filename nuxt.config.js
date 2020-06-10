require('dotenv').config()
const {getRouterBase} = require('./src/utils')
const path = require('path')
const {env} = process
;['PUBLIC_PATH', 'API_SERVER', 'NO_LOGIN', 'COOKIE_PATH'].forEach(key =>
  // eslint-disable-next-line no-console
  console.log('%s\t: %s', key, env[key]),
)
const appJson = require('./app.json')
const isProd = env.MODE == 'prod'
const mockServer = 'http://39.100.141.76:3000/mock/679'

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 不能以斜杠结尾
let apiServer = env.API_SERVER
// 必须以斜杠结尾
let publicPath =
  process.env.BUILD_TYPE === 'production'
    ? `http://serverless-platform.deepexi.top/applications/${appJson.appKey}`
    : env.PUBLIC_PATH

const config = {
  aliIconFont: '',
  env: {
    mock: {
      '/deepexi-tenant': mockServer,
      '/deepexi-permission': mockServer,
      '/deepexi-system-digital-retail': mockServer,
    },
    dev: apiServer
      ? {
          '/asset-service': apiServer,
          '/deepexi-cloud': apiServer,
          '/deepexi-tenant': apiServer,
          '/deepexi-permission': apiServer,
          '/deepexi-system-digital-retail': apiServer,
        }
      : {},
  },
}

let axios = {
  proxy: true,
}

// 如果生产指定apiServer, 则使用绝对路径请求api
if (isProd && apiServer) {
  axios = {
    proxy: false,
    baseURL: apiServer,
  }
}

module.exports = {
  srcDir: 'src/',
  mode: 'spa',
  env: {
    MODE: env.MODE,
    NO_LOGIN: env.NO_LOGIN,
    COOKIE_PATH: env.COOKIE_PATH || '/',
  },
  proxy: config.env[env.MODE],
  router: {
    middleware: ['meta', 'auth'],
    mode: 'hash',
  },
  /*
   ** Build configuration
   */
  build: {
    publicPath,
    extractCSS: isProd,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: '~node_modules/@spaas/dr-theme-chalk/lib',
          },
        ],
      ],
    },
    extend(config, {isDev}) {
      if (isDev) {
        config.devtool = '#source-map'
      }
      config.module.rules = config.module.rules.filter(
        item => !item.test.test('.svg'),
      )

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      })

      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/,
        exclude: [resolve('src/icons')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000, // 1K limit
              name: 'img/[name].[hash:8].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      })

      /**
       * upload-to-ali组件依赖ali-oss脚本，体积较大。
       * 这里将该依赖放在script处用引入，可利用cdn加速，并减少项目最终打包体积
       * FYI: 如果不需要upload-to-ali组件，记得在移除组件后也要移除在script引用的ali-oss脚本
       */
      config.externals = {
        'ali-oss': 'OSS',
      }
    },
  },
  /*
   ** Headers of the page
   */
  head: {
    script: [
      {src: '//at.alicdn.com/t/font_1451252_j9pxu48sp8.js'},
      {
        src:
          'https://cdn.jsdelivr.net/npm/ali-oss@6.1.1/dist/aliyun-oss-sdk.min.js',
      },
    ],
    title: '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {'http-equiv': 'x-ua-compatible', content: 'IE=edge, chrome=1'},
      {
        hid: 'description',
        name: 'description',
        content: '',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services/favicon32x32.png',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//at.alicdn.com/t/font_1451252_2iem1p5o7ki.css',
      },
    ],
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#5D81F9',
  },
  /**
   * Share variables, mixins, functions across all style files (no @import needed)
   * @Link https://github.com/nuxt-community/style-resources-module/
   */
  styleResources: {
    less: '~assets/var.less',
  },
  css: [
    {
      src: '~assets/global.less',
      lang: 'less',
    },
    {
      src: '~assets/reset.less',
      lang: 'less',
    },
  ],
  plugins: [
    {src: '~plugins/axios'},
    {src: '~plugins/filters'},
    {src: '~plugins/element'},
    {src: '~plugins/icon-font'},
    {src: '~plugins/breadcrumb'},
  ],
  modules: [
    '@femessage/nuxt-modularize',
    // Doc: https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/dotenv', {path: './'}],
    // Doc: https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',
  ],
  axios,
  workbox: {
    routerBase: getRouterBase(publicPath),
    runtimeCaching: [
      {
        urlPattern: 'https://easy-mock.com/*',
        handler: 'staleWhileRevalidate',
      },
    ],
  },
}
