import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-purchase', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function createPurchaseOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase/create-purchase-order', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addGoodsInBuffer ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase/add-goods-in-buffer', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setChangePurchaseOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase/change-purchase-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function clearBufferData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase/clear-buffer-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function editBufferData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-purchase/edit-buffer-data', item)
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
    let apiUrl = 'v3/erp-purchase/delete?id='
    apiUrl += item
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

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/erp-purchase/view?id=' + parseInt(itemId.id)
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

export function getLogData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-purchase/log', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getInvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-purchase/invoice', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function uploadPurchase ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-purchase/upload-purchase', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
