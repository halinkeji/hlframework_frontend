import { api } from 'boot/axios'

// 获取单据列表
export function getInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/invoice', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getPointInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/invoice/point', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMoneyInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/invoice/money', { params: item })
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
      .get('v3/invoice/view', { params: item })
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
      .post('v3/invoice/addprefix', item)
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
      .get('v3/invoice/prefix')
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
      .get('v3/invoice/count', { params: item })
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
      .get('v3/invoice/print', { params: item })
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
      .get('v3/invoice/return', { params: item })
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
      .get('v3/invoice/time', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getInvoiceLogList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/get-invoice-log-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function changeInvoiceCreateTimeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/invoice/change-invoice-create-time-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
