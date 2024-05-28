import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/order-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
