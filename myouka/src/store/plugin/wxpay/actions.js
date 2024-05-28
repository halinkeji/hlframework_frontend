import { api } from 'boot/axios'

export function getItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxpay/v1/config'
    api
      .get(apiUrl, { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxpay/v1/config/create'
    const requestType = 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
