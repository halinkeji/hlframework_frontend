// import something here
import store from '../store/index'
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async (/* { app, router, Vue ... } */) => {
  // something to do
}
export function setDebug (err_msg, info_trace, type) {
  const item = {
    err_msg,
    info_trace,
    type,
    client: 'wechat'
  }
  store()
    .dispatch('settings/electronDebug', item)
    .then((res) => {
    })
    .catch((error) => {})
}
