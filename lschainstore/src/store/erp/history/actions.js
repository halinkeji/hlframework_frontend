import { api } from 'boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-history', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
