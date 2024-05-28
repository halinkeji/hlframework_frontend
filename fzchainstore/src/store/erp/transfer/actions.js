import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-transfer', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function createTransferOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-transfer/create-transfer-order', params)
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
    api.post('v3/erp-transfer/add-goods-in-buffer', params)
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
    const apiUrl = 'v3/erp-transfer/view?id=' + parseInt(itemId.id)
    api.get(apiUrl)
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
    let apiUrl = 'v3/erp-transfer/delete?id='
    apiUrl += item
    api.delete(apiUrl)
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
      .post('v3/erp-transfer/edit-buffer-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function changeTransferOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-transfer/change-transfer-order', params)
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
    api.post('v3/erp-transfer/clear-buffer-data', params)
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
    let apiUrl = 'v3/erp-transfer/'
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
      .post('v3/erp-transfer/alldel')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setBuffData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-transfer/addbuf', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getBufferData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-transfer/buttfer', { params: item })
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
      .post('v3/erp-transfer/editbut', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getAllData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-transfer/depot', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDepotData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-transfer/depotnumber', { params: item })
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
      .get('v3/erp-transfer/invoice', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function addGoodsBufer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-transfer/addbufer', item)
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
      .post('v3/erp-transfer/upload', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
