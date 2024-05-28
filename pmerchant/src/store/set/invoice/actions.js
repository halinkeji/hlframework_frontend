import { api } from 'src/boot/axios'

// 获取单据列表
export function getInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getPointInvoiceList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/point', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取单据列表
export function getMoneyInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/money', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取单据详情
export function getInvoiceView ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/view', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 获取单据前缀
export function addPrefix ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/invoice/addprefix', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 保存单据前缀
export function getPrefixData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/prefix')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 获取计次消费列表
export function getCountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/count', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getInvoicePrint ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/print', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 获取退货单据列表
export function getReturnInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/return', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getTimeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/invoice/time', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
