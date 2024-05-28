import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-purchase-return', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function createReturnPurchaseOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase-return/create-purchase-return-order', params)
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
    const apiUrl = 'v3/erp-purchase-return/view?id=' + parseInt(itemId.id)
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

export function addGoodsInBuffer ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase-return/add-goods-in-buffer', params)
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
    let apiUrl = 'v3/erp-purchase-return/delete?id='
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

export function editBufferData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase-return/edit-buffer-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function clearBufferData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase-return/clear-buffer-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function changePurchaseReturnOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-purchase-return/change-purchase-return-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/erp-purchase-return/'
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

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-purchase-return/alldel')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addGoodsBuf ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-purchase-return/addbuf', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getGoodsBuf ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-purchase-return/buttfer', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function editButtfer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-purchase-return/editbut', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function upload ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-purchase-return/upload', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
