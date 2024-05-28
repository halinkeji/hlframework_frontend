import { api } from 'boot/axios'

export function setData({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = 'v3/point/'
    apiUrl += parseInt(item.id) > 0 ? "update?id=" + parseInt(item.id) : "create"
    var requestType = parseInt(item.id) > 0 ? "put" : "post"
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}