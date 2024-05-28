import { api } from 'boot/axios'

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/returnfoods/view?id=' + itemId)
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
    api
      .post('v3/returnfoods/create', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setSingleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/returnfoods/setsingle', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setRevokeOrder ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/returnfoods/revoke', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setRevokeOrderCount ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/returnfoods/revokecount', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setRevokeOrderTime ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/returnfoods/revoketime', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
