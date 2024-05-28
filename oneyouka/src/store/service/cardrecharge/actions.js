import { api } from 'boot/axios'

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/card-recharge/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/card-recharge/all-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getMemberCard ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/card-recharge/get-card', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
