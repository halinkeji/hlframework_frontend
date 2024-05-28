import { api } from 'src/boot/axios'

export function getItem ({ commit }) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'cdyy/v1/set'
    api.get(apiUrl)
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
    const apiUrl = 'cdyy/v1/set/create'
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

export function getSiteData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cdyy/v1/site', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSiteItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('cdyy/v1/site/get-item', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setSiteData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'cdyy/v1/site/'
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
export function delSiteData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('cdyy/v1/site/delete-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getStoreSiteData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('cdyy/v1/site/get-store-site-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('cdyy/v1/record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('cdyy/v1/record/create', params)
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
    api.post('cdyy/v1/record/change-record-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function refundTimeAmount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('cdyy/v1/record/refund-time-amount', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function confirmRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('cdyy/v1/record/confirm-record-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCouponListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cdyy/v1/coupon', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCouponItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('cdyy/v1/coupon/get-item', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setCouponData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'cdyy/v1/coupon/'
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

export function delCouponData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('cdyy/v1/coupon/delete-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCouponRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('cdyy/v1/coupon/get-record-data-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function queryCodeSiteInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('cdyy/v1/record/query-code-site-info', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function checkSite ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('cdyy/v1/record/check-site', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
