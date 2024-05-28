import Vue from 'vue'
import VueRouter from 'vue-router'
import { LoadingBar, Cookies, LocalStorage, Dialog } from 'quasar'
import {
  isAuthenticated,
  isCookiesTokenExpir,
  isLocalStorageTokenExpir,
  removeAllCookies,
  removeAllLocalStorage,
  setAllLocalStorage,
  authConfig,
  isCurrentApply
} from '@/utils/common'
import routes from './routes'

import store from '../store/index'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
// oauth登录url
const oauth_url =
  authConfig.login_uri +
  '?response_type=code&appId=' +
  authConfig.appId +
  '&redirect_uri=' +
  authConfig.redirect_uri

const Router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

const currentRouterData = LocalStorage.getItem('myonestore_router_local')
if (currentRouterData) {
  routes[1].children = getFormatRoutes(currentRouterData)
  Router.addRoutes(routes)
} else {
  getRouterData()
}

import layout from '../components/Layout/Layout.vue'

function getFormatRoutes (arr, value = null, level = 0) {
  return arr.map(item => {
    if (item.component) {
      var obj = {
        path: item.path ? item.path : '/',
        name: item.name ? item.name : item.label,
        component: () => import('@/pages' + item.component)
      }
    } else {
      var obj = {
        path: item.path ? item.path : '/',
        name: item.name ? item.name : item.label,
        component: layout
      }
    }
    obj.meta = []
    if (item.meta) {
      obj.meta = item.meta
    }
    if (item.title) {
      obj.meta.title = item.title
    }

    if (item.children && item.children.length > 0) {
      obj.children = getFormatRoutes(item.children, value, level + 1)
    }

    return obj
  })
}

function getRouterData () {
  const Store = store()
  Store.dispatch('user/roleInfo')
    .then(res => {
      if (res.data) {
        const allRouter = getFormatRoutes(res.data.router)

        LocalStorage.set('myonestore_router_local', res.data.router)
        routes[1].children = allRouter
        Router.addRoutes(routes)

        const menu = res.data.menu || []
        const businessMenu = res.data.businessMenu || []

        // 写入左侧菜单
        LocalStorage.set('myonestore_left_menu_navigate_local', menu)
        Store.commit('settings/SET_MENUData', menu)

        // 写入业务菜单
        LocalStorage.set('myonestore_business_menu_navigate_local', businessMenu)
        Store.commit('settings/SET_BUSINESS_MENU', businessMenu)

        LocalStorage.set('myonestore_system_local', res.data.system_local)
        LocalStorage.set('myonestore_apply_local', res.data.apply_local)
        LocalStorage.set('myonestore_store_local', res.data.store_local)
        LocalStorage.set('myonestore_plugins_local', res.data.plugins_local)
        location.reload()
      } else {
        Dialog.create({
          title: '错误',
          message: '暂无权限退出至登录'
        }).onOk(() => {
          removeAllLocalStorage()
          removeAllCookies()
          window.location.href = oauth_url
        })
      }
    })
    .catch(error => {})
}

Router.beforeEach((to, from, next) => {
  LoadingBar.start()

  // 验证当前路由所有的匹配中是否需要有登录验证的to.meta.auth
  if (!currentRouterData) {
    getRouterData()
  }

  if (to.meta.auth) {
    // 验证sso是否登录
    if (Cookies.get('loggedIn')) {
      // 判断是否即将过期
      if (isCookiesTokenExpir() || !isCurrentApply()) {
        removeAllLocalStorage()
        removeAllCookies()
        window.location.href = oauth_url
        return false
      }

      // 验证本地用户是否已经登录
      if (isAuthenticated()) {
        // 判断accessToken即将到期后刷新token
        if (isLocalStorageTokenExpir()) {
          removeAllLocalStorage()
          removeAllCookies()
          window.location.href = oauth_url
          return false
        }

        // //页面中转
        // if (to.name === 'index' || to.path === '/index' || to.path === '/') {
        //     router.push(router.currentRoute.query.to || '/')
        //     return false;
        // }
        // 无效页面跳转至首页
        // if (!to.name) {
        //   next({ path: '/error404' })
        //   return false;
        // }
        LoadingBar.stop()
        return next()
      }

      setAllLocalStorage()

      // 无效页面跳转至首页
      if (!to.name) {
        next({ path: '/error404' })
        return false
      }

      return next()
    }
    removeAllLocalStorage()
    removeAllCookies()
    window.location.href = oauth_url
  } else {
    // 无效页面跳转至首页
    if (!to.name) {
      next({ path: '/error404' })
      return false
    }

    // 不需要身份校验 直接通过
    return next()
  }
  LoadingBar.stop()
})

Router.afterEach(() => {
  LoadingBar.stop()
})

export default Router
