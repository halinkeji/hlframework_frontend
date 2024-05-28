import { api } from 'src/boot/axios'

export function getItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('wxmall/v1/wxsetting', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'wxmall/v1/wxsetting/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('wxmall/v1/wxsetting/get-config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
