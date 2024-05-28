import { api } from 'src/boot/axios'

export function dataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-supplier', { params })
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
    let apiUrl = 'v3/erp-supplier/'

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
    const apiUrl = 'v3/erp-supplier/view?id=' + parseInt(item)

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
    const apiUrl = 'v3/erp-supplier/alldel'

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
    const apiUrl = 'v3/erp-supplier/delcontacts'
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
    const apiUrl = 'v3/erp-supplier/lists'

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
      .get('v3/erp-supplier/supp', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
