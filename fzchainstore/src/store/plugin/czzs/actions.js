import { api } from 'boot/axios'

export function setCzzsRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.put('czzs/v1/czzs/update?id=' + params.id, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCzzsRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('czzs/v1/czzs', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getSetSwitch ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('czzs/v1/czzs/get-switch')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setSwitch ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('czzs/v1/czzs/set-switch', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
