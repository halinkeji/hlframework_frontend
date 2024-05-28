import { api } from 'boot/axios'

export function getDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order-in', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function createOrderInData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-order-in/create-order-in-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function changePurchaseInDepotOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order-in/change-purchase-in-depot-order', params)
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
    const apiUrl = 'v3/erp-order-in/view?id=' + parseInt(itemId.id)
    api.get(apiUrl)
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
      .post('v3/erp-order-in/edit-buffer-data', item)
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
      .post('v3/erp-order-in/change-buffer-quantity', params)
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
    let apiUrl = 'v3/erp-order-in/'
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
    let apiUrl = 'v3/erp-order-in/delete?id='
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
      .post('v3/erp-order-in/alldel')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addOrderInBuf ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order-in/addbuf', item)
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
      .get('v3/erp-order-in/buttfer', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSupp ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order-in/supp')
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
      .get('v3/erp-order-in/buttfer', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getWuliuData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-order-in/wuliu', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setWuliuData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order-in/wuliudata', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addGoodsBufer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-order-in/addbufer', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
