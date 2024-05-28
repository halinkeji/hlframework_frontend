import { api } from 'boot/axios'

export function getMemberList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/member-tag', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getMembertagList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/member-tag/list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getMembertagCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/member-tag/count', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/member-tag/view?id=' + parseInt(item)

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
    let apiUrl = 'v3/member-tag/'
    apiUrl +=
      parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/member-tag/delete?id='
    apiUrl += item
    api
      .delete(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getTagData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/member-tag/data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getAllTag ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/member-tag/all-list'
    api
      .get(apiUrl, { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
