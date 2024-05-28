import { api } from 'boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getNumber ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/number', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setNumber ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/erp-number/setnumber'
    const requestType = 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/lists', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getItems ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/return', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTotal ({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/total')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getSale ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/salelist', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getStore ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/store-list', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getOut ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/out', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getChange ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/listc', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getConsum ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/listcon', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getReturn ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/listret', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCostPice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/goodsin', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getPurchase ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/purchase', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getOrder ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/order-goods', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getAllocation ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/allocation', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getTransfer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/transfer', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getStoreReturn ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/store-return', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getPurchaseIn ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/purchase-in', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getChangeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/change', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getListDataHeng ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/list-data', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
