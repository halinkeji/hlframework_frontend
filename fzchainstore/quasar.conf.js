/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
const path = require('path')
const crossSpawn = require('cross-spawn')
module.exports = function (ctx) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,
    rtlSupport: true,
    treeShake: true,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'i18n',
      'axios',
      'vconsole',
      'component.js',
      'utils.js',
      'vecharts'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ['app.scss', 'iconfont/iconfont.css', 'ag-grid-table.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'ionicons-v4',
      // 'mdi-v5',
      'fontawesome-v5',
      'eva-icons',
      // 'themify',
      'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'

      publicPath: process.env.NODE_ENV === 'production' ? 'hls4xO1Ja4T8xIJizY' : '/',
      env: ctx.dev
        ? {
            BASE_URL_API: ''
          }
        : {
            BASE_URL_API: 'hlj0207I7uAX2IHb8Z'
          },
      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      transpileDependencies: [],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      showProgress: true,
      gzip: true,
      analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      extendWebpack (cfg, { isServer, isClient }) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          // 添加目录结构别名
          css: path.resolve(__dirname, './src/css'),
          assets: path.resolve(__dirname, './src/assets'),
          pages: path.resolve(__dirname, './src/pages'),
          utils: path.resolve(__dirname, './src/utils'),
          '@': path.resolve(__dirname, './src')
        }
        // cfg.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /node_modules/
        // })
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
      // host: 'wx.halin.net.cn',
      // disableHostCheck: true, // 禁止检查host头
      // proxy: {
      //   '/api': {
      //     target: 'http://wx.halin.net.cn/', // 对应自己的接口
      //     changeOrigin: true,
      //     ws: true,
      //     pathRewrite: {
      //       '^/api': ''
      //     }
      //   }
      // }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'zh-hans', // Quasar language pack
      config: {
        notify: {
          /* look at QUASARCONFOPTIONS from the API card (bottom of page) */
        }
      },

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      components: [],
      directives: [],

      // Quasar plugins
      plugins: [
        'Loading',
        'Notify',
        'LoadingBar',
        'LocalStorage',
        'SessionStorage',
        'Cookies',
        'Meta',
        'Dialog',
        'AppFullscreen'
      ]
    },

    animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    // animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'hlframework frontend web fzchainstore',
        short_name: 'hlframework frontend web fzchainstore',
        description: 'hlframework frontend web fzchainstore',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: []
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'builder', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        win32metadata: {
          name: '哈林智慧服装连锁版'
        }
      },

      beforePackaging (params) {
        return new Promise(resolve => {
          const runner = crossSpawn(
            '..\\..\\..\\node_modules\\.bin\\electron-rebuild -f -v 9.4.4 -w serialport',
            [''],
            {
              stdio: 'inherit',
              stdout: 'inherit',
              stderr: 'inherit',
              cwd: params.unpackagedDir
            }
          )
          runner.on('close', () => {
            resolve()
          })
        })
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'hlframework_e_fzchainstore',
        // artifactName: 'hlframework'
        // 项目名 这也是生成的exe文件的前缀名，指定一下程序名称，这个对于后面创建桌面快捷方式和开始菜单都有关系
        productName: '哈林智慧服装连锁版',

        // 版权信息
        copyright: '内蒙古哈林网络科技有限公司',

        // win: {
        //   target: 'nsis'
        // },
        buildDependenciesFromSource: true,
        npmRebuild: false,
        // artifactName: 'hlframework'
        // asar打包，如果为true会将依赖就加密成.asar文件，导致serialport串口通信C环境无法被打包，而无法使用
        asar: false,
        // 安装配置
        nsis: {
          // 是否一键安装，建议为 false，可以让用户点击下一步、下一步、下一步的形式安装程序，如果为true，当用户双击构建好的程序，自动安装程序并打开，即：一键安装（one-click installer）
          oneClick: false,
          // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowElevation: true,
          // 允许修改安装目录，建议为 true，是否允许用户改变安装目录，默认是不允许
          allowToChangeInstallationDirectory: true,
          // // 安装图标
          // 'installerIcon': 'build/installerIcon_120.ico',
          // // 卸载图标
          // 'uninstallerIcon': 'build/uninstallerIcon_120.ico',
          // // 安装时头部图标
          // 'installerHeaderIcon': 'build/installerHeaderIcon_120.ico',
          // 创建桌面图标
          createDesktopShortcut: true,
          // 创建开始菜单图标
          createStartMenuShortcut: true
          // electron中LICENSE.txt所需要的格式，并非是GBK，或者UTF-8，LICENSE.txt写好之后，需要进行转化，转化为ANSI
          // 'license': 'LICENSE.txt'
        }
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
        cfg.externals = {
          // serialport: 'serialport',
        }
      }
    }
  }
}
