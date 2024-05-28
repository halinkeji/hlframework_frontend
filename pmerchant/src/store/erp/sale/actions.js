import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-sale', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getMoney ({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-sale/money')
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
    let apiUrl = 'v1/erp-sale/'
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

export function delBuf ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/erp-sale/delbuf', item)
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
      .post('v1/erp-sale/alldel', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function addSaleDetail ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/erp-sale/addsaledetail', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setSaleDetail ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/erp-sale/setsaledetail', item)
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
      .get('v1/erp-sale/supp')
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
      .post('v1/erp-sale/addbuf', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getGoodsBuf ({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-sale/buttfer')
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
      .post('v1/erp-sale/editbut', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSaleDetail ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-sale/outdata', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function editOutAdd ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/erp-sale/outadd', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getErpOut ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-sale/erpout', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function settleInvoice ({ commit }, parasm) {
  return new Promise((resolve, reject) => {
    api.post('v1/erp-sale/settle', parasm)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
