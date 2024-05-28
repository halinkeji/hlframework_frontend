import { api } from 'src/boot/axios'

export function getDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/finance', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function changeRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/finance/change-record-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getMechantWithdrawCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/finance/get-mechant-withdraw-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setMechantWithdrawData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/finance/set-mechant-withdraw-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getWithdrawDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/finance/get-withdraw-data-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function updateMechantWithdrawData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/finance/update-mechant-withdraw-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getOrderDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/finance/get-order-data-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCountCharts ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/finance/get-count-charts', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
