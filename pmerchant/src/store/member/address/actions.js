import { api } from 'src/boot/axios'

export function getMemberList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/member-address/member', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAddressList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/member-address', { params: item })
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
    const apiUrl = 'v1/member-address/view?id=' + parseInt(id)
    api
      .get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/member-address/update?id=' + parseInt(item.id)
    const requestType = 'put'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSummary ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/member-address/summary', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getInvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/member-address/invoice', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getLastData () {
  return new Promise((resolve, reject) => {
    api
      .get('v1/member-address/last')
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
    api
      .get('v1/member-address/switch')
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
    const apiUrl = 'v1/member-address/status'
    const requestType = 'put'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function deteleAddress ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .delete('v1/member-address/delete', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
