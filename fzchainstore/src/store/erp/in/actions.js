import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-in', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function createPurchaseInDepotOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-in/create-purchase-in-depot-order', params)
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
    const apiUrl = 'v3/erp-in/view?id=' + parseInt(itemId.id)
    api.get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function changePurchaseInDepotOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-in/change-purchase-in-depot-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function editBufferData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-in/edit-buffer-data', params)
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
      .post('v3/erp-in/change-buffer-quantity', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addGoodsBufer ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-in/addbufer', params)
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
    let apiUrl = 'v3/erp-in/'
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
    let apiUrl = 'v3/erp-in/delete?id='
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
      .post('v3/erp-in/alldel')
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
      .post('v3/erp-in/addbuf', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getThData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-out/outdata', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function editOutAdd ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-out/outadd', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getErpOut ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-out', { params: item })
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
      .get('v3/erp-in/supp')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getInMember ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-in/inmember', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
