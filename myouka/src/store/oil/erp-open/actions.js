import { api } from 'boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/oil-open', { params: item })
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
    let apiUrl = 'v3/oil-open/'
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
    const apiUrl = 'v3/oil-open/view?id=' + item

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

export function getSupplierTypeList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/oil-open/list', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getTypeList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/oil-erp-supplier-type/list', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getOilCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/oil-open/oilcount', {
        params
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilOpenList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/oil-open/open-list', {
        params
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getOpenInvoiceDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/oil-open/open-invoice-detail', {
        params
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
