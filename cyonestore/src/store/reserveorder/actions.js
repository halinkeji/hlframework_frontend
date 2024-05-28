import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reserve-order/config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getReserveData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reserve-order', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reserve-order/'
    apiUrl +=
      parseInt(params.id) > 0 ? 'update?id=' + parseInt(params.id) : 'create'
    const requestType = parseInt(params.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reserve-order/'
    apiUrl +=
      parseInt(params.id) > 0 ? 'update-config?id=' + parseInt(params.id) : 'create-config'
    const requestType = parseInt(params.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/reserve-order/view?id=' + params

    api
      .get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-order/get-reserve-config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getReserveDeskPosition ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-order/get-reserve-desk-position', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getWeekReserveCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-order/get-week-reserve-count', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCurrentReserveDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-order/get-current-reserve-detail', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRecordInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-order/get-record-info', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 设置撤销订单
export function changeRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.put('v3/reserve-order/change-record-data?id=' + parseInt(params.id), params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
