import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/merchant', { params: item })
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
      .post('v3/merchant/create', item)
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
    api
      .post('v3/merchant/delete-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDataList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/merchant/lists', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAccountDataList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/merchant/account', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRoleStoreList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/merchant/role', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setAccount ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/merchant/set-account', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getLibInStoreData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/merchant/lib-store', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
