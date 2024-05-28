import { api } from 'boot/axios'

export function quickSetData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/oil-consume/create', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function setDebtCreate ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/oil-consume/debt-create', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
