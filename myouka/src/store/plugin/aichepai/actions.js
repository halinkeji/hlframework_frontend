import { api } from 'boot/axios'

export function getItem ({ commit }) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'aichepai/v1/config'
    api.get(apiUrl)
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
    const apiUrl = 'aichepai/v1/config/create'
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
