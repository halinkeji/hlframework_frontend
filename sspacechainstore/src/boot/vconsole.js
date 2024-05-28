import Vue from 'vue'
import vConsole from 'vconsole'
import { setDebug } from 'boot/utils'

import { LocalStorage } from 'quasar'
const applyLocal = LocalStorage.getItem('sspacechainstore_apply_local')
const envConfig = applyLocal && applyLocal.env ? applyLocal.env : {}
if (envConfig.frontend && envConfig.frontend.pc) {
  if (envConfig.frontend.pc == 'dev') {
    const VConsole = new vConsole()
    Vue.use(VConsole)
  }
}

if (envConfig.frontend && envConfig.frontendLog) {
  if (parseInt(envConfig.frontendLog) == 1) {
    Vue.config.errorHandler = function (err, vm, info) {
      // err: 具体错误信息
      // vm: 当前错误所在的Vue实例
      // info: 错误所在的生命周期钩子
      setDebug(err.toString(), info, 'error')
      // console.warn('Vue全局errorHandler异常捕获开始===========')
      // console.log(`Error: ${err.toString()}\nInfo: ${info}`)
    }

    Vue.config.warnHandler = function (msg, vm, trace) {
      // msg: 具体警告信息
      // vm: 当前错误所在的Vue实例
      // trace: 警告所在的追踪位置
      setDebug(msg.toString(), trace, 'warning')
      // console.warn('Vue全局warnHandler异常捕获开始===========')
      // console.log(`Warn: ${msg.toString()}\ntrace: ${trace}`)
      // console.log('VM:', vm)
    }
  }
}
