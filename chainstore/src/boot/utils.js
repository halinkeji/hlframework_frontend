// import something here
import store from '../store/index'
import { LocalStorage } from 'quasar'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async (/* { app, router, Vue ... } */) => {
  // something to do
}
export function setDebug (err_msg, info_trace, type) {
  const applyLocal = LocalStorage.getItem('chainstore_apply_local')
  const envConfig = applyLocal && applyLocal.env ? applyLocal.env : {}

  if (envConfig.frontend && envConfig.frontendLog) {
    if (parseInt(envConfig.frontendLog) == 1) {
      const item = {
        err_msg,
        info_trace,
        type,
        client: 'pc'
      }
      store()
        .dispatch('settings/electronDebug', item)
        .then((res) => {
        })
        .catch((error) => {})
    }
  }
}
