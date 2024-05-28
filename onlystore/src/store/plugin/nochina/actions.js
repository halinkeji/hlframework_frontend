import { api } from 'src/boot/axios'

export function getConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('nochina/v1/config', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setConfig ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'nochina/v1/config/create'

    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCodeList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'nochina/v1/config/code-list'
    api.get(apiUrl, { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setCodeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'nochina/v1/config/create-code'
    api.post(apiUrl, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function deteleCode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.delete('nochina/v1/config/delete', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
