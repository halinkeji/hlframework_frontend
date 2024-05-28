import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-allocation', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function createAllocationOrderData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-allocation/create-allocation-order-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function changeAllocationOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-allocation/change-allocation-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/erp-allocation/view?id=' + parseInt(itemId.id)
    api.get(apiUrl)
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
    let apiUrl = 'v3/erp-allocation/'
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
    let apiUrl = 'v3/erp-allocation/delete?id='
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

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-allocation/alldel')
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
      .post('v3/erp-allocation/addbuf', item)
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
      .get('v3/erp-allocation/buttfer', { params: item })
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
      .post('v3/erp-allocation/edit-buffer-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function changeBufferQuantity ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-allocation/change-buffer-quantity', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getDeopt ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-allocation/deopt', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setGoodsCode ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-allocation/goodscode', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setTransfer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-allocation/transfer', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setOrder ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-allocation/updateorder', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
