import { api } from 'boot/axios'

// 获取单据列表
export function getInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 获取积分单据列表
export function getPointInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/point', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 获取储值单据列表
export function getMoneyInvoiceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/money', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 获取单据详情
export function getInvoiceView ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/view', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 获取单据前缀
export function addPrefix ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/invoice/addprefix', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 保存单据前缀
export function getPrefixData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/prefix')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
// 获取计次消费列表
export function getCountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/count', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getInvoicePrint ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/print', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getOilConsumeList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/invoice/oil-consume-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
