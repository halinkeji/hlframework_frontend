import { api } from 'src/boot/axios'

export function getDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/views', { params })
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
    let apiUrl = 'v1/merchant/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
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

export function getApplyList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/get-apply-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/get-list-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function updateMerchant ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.put('v1/merchant/update-merchant?id=' + params.id, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function verifyMobileOnly ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/verify-mobile-only', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setWxappQrcode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/set-wxapp-qrcode', { params })
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
    api.get('v1/merchant/get-merchant-extend-data', { params })
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
    api.post('v1/merchant/set-merchant-extend-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function checkMerchantStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/merchant/check-merchant-status', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function merchantApplyJoinData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/merchant/merchant-apply-join-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getProductListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/get-product-list-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTransferMemberId ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/get-transfer-member-id', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setTransferMemberId ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/merchant/set-transfer-member-id', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getMerchantQrcode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/merchant/get-merchant-qrcode', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
