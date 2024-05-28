import { api } from 'boot/axios'

export function dataList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/supplier', { params: item })
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
    let apiUrl = 'v3/supplier/'

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

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/supplier/view?id=' + parseInt(item)

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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/supplier/alldel'

    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delContacts ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/supplier/delcontacts'
    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getTypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/supplier/lists'
    api
      .get(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getSupp ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/supplier/supp', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function typeDataList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/supplier/type', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/supplier/'
    apiUrl +=
      parseInt(item.id) > 0 ? 'typeupdate?id=' + parseInt(item.id) : 'typecreate'
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

export function getTypeItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/supplier/typeview?id=' + parseInt(item)
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

export function deltypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/supplier/typealldel'
    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
