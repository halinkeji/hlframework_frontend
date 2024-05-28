import { api } from 'src/boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('hlcoupon/v1/coupon', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hlcoupon/v1/coupon/view?id=' + parseInt(item.id)

    api
      .get(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'hlcoupon/v1/coupon/'
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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hlcoupon/v1/coupon/alldel'

    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function send ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hlcoupon/v1/coupon/send'

    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSendList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('hlcoupon/v1/coupon/sendlists', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function couponCheckList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hlcoupon/v1/coupon/couponchecklist'

    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function couponCheck ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hlcoupon/v1/coupon/couponcheck'

    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hlcoupon/v1/coupon/set-status'

    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function inquireCoupon ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('hlcoupon/v1/coupon/inquire-coupon', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMarketListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('hlcoupon/v1/coupon-market', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setMarketPass ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('hlcoupon/v1/coupon-market/set-market-pass', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getUsedCouponList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('hlcoupon/v1/coupon-market/get-used-coupon-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function cancelPmerchantCheck ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('hlcoupon/v1/coupon-market/cancel-pmerchant-check', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getCouponUseList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('hlcoupon/v1/coupon-market/get-coupon-use-list', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
