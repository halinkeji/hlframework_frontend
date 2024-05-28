import { api } from 'src/boot/axios'

export function getItem({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('wechat/v1/customize', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setData({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'wechat/v1/customize/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function newkey({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('wechat/v1/customize/newkey', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
