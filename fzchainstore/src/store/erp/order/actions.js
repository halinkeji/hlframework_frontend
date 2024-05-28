import { api } from 'boot/axios'
export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order/detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function createDetailOrderData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-order/create-detail-order-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addGoodsInBuffer ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-order/add-goods-in-buffer', params)
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

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/erp-order/view?id=' + parseInt(itemId.id)
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
    let apiUrl = 'v3/erp-order/'
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
export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/erp-order/'
    apiUrl += parseInt(item.id) > 0 ? 'updateinfo?id=' + parseInt(item.id) : 'addinfo'

    api.post(apiUrl, item)
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
    let apiUrl = 'v3/erp-order/delete?id='
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

export function clearBufferData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-order/clear-buffer-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setChangePatchOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-order/change-patch-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

//  分隔

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order/alldel')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addGoodsBuf ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order/addbuf', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getGoodsBuf ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order/buttfer', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function editButtfer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order/editbut', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTypeDetail ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order/type-detail', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getInvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order/invoice', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function upload ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order/upload', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
