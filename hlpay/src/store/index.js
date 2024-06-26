import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'
import settings from './settings'
import components from './components'
import upload from './upload'
import role from './rbac/role'
import user from './rbac/user'
import isv from './isv'
import mch from './mch'
import snapshot from './snapshot'
import order from './order'
import refund from './refund'
import refundOrder from './refund-order'
import allot from './allot'
import speaker from './speaker'
import cloudprinter from './cloudprinter'
import qrcode from './qrcode'
import transferOrder from './transfer-order'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      example,
      components,
      upload,
      role,
      user,
      isv,
      mch,
      snapshot,
      order,
      refund,
      refundOrder,
      allot,

      // 插件
      speaker,
      cloudprinter,
      qrcode,
      settings,

      transferOrder
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
    // strict: false
  })
  return Store
}
