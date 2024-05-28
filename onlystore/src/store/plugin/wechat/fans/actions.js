import { api } from 'src/boot/axios'

export function updateAllFans ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wechat/v1/fans')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getfanslist ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wechat/v1/fans/fanslist', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getGroups ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wechat/v1/fans/groups', { params: item })
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
    let apiUrl = 'wechat/v1/fans/'
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
    const apiUrl = 'wechat/v1/fans/delete?id=' + parseInt(item.id)

    api
      .delete(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function batchGroup ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('wechat/v1/fans/batch', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function updateFans ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('wechat/v1/fans/fansall', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
