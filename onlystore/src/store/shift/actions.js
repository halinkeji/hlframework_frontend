import { api } from 'src/boot/axios'

export function getLastData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/last', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSummary ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/summary', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/shift/view?id=' + parseInt(id)
    api.get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/shift/create'
    const requestType = 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getInvoice ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/invoice', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/switch')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/shift/status'
    const requestType = 'put'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
