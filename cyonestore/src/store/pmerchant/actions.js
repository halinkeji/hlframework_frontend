import { api } from 'src/boot/axios'

export function getDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/pmerchant', { params })
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
    api.post('v3/pmerchant/change-record-data', params)
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
    api.get('v3/pmerchant/get-mechant-withdraw-count', { params })
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
    api.post('v3/pmerchant/set-mechant-withdraw-data', params)
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
    api.get('v3/pmerchant/get-withdraw-data-list', { params })
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
    api.post('v3/pmerchant/update-mechant-withdraw-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getMerchantExtendData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/pmerchant/get-merchant-extend-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveMerchantExtendData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/pmerchant/set-merchant-extend-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getApplyJoinData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/pmerchant/get-apply-join-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function merchantApplyJoinData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/pmerchant/merchant-apply-join-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
