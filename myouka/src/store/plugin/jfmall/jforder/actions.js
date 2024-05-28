import { api } from 'src/boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/jf-order', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/jf-order/view?id=' + itemId)
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
    let apiUrl = 'jfmall/v1/jf-order/'
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
    let apiUrl = 'jfmall/v1/jf-order/delete?id='
    apiUrl += item
    api
      .delete(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function confirmOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('jfmall/v1/jf-order/confirm-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setOrderDelivery ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('jfmall/v1/jf-order/set-order-delivery', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function checkOrderDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/jf-order/check-order-detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function cancelOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('jfmall/v1/jf-order/cancel-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function agreeBackOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('jfmall/v1/jf-order/agree-back-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function refuseBackOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('jfmall/v1/jf-order/refuse-back-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function confirmBackOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('jfmall/v1/jf-order/confirm-back-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getBackOrderData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/jf-order/get-back-order-lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 申请售后
export function backGoodsItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/jf-order/back-goods-item', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 确认收货
export function setGetOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('jfmall/v1/jf-order/set-get-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
