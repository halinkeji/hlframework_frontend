import { api } from 'src/boot/axios'

export function getTemplatData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/speak/get-templat-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setTemplatData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/speak/set-templat-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSpaekListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/speak/get-spaek-list-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
