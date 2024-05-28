import { api } from 'boot/axios'

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('infoqr/v1/config', { params })
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
    let apiUrl = 'infoqr/v1/config/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
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

export function getUserList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('infoqr/v1/user-info', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getUserItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('infoqr/v1/user-info/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'infoqr/v1/user-info/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
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

export function delteleUserInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('infoqr/v1/user-info/all-del', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
