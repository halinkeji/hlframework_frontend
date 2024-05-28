import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/debt', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/debt/view?id=' + parseInt(item.id)

    api.get(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/debt/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function debtSetData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/debt/setdata'
    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getbufferItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/debt/bufferitem', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function closeOrder ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/debt/closeorder'
    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getConsumeList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/debt/consumelist', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getMemberArrearsData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/debt/get-arrears-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function setSettleInvoice ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/debt/set-settle-invoice', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
