import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/wxmall/wxorder', { params: item })
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
      .get('v3/wxmall/wxorder/view?id=' + itemId)
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
    let apiUrl = 'v3/wxmall/wxorder/'
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
    let apiUrl = 'v3/wxmall/wxorder/delete?id='
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
      .post('v3/wxmall/wxorder/confirm-order', params)
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
      .post('v3/wxmall/wxorder/set-order-delivery', params)
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
      .get('v3/wxmall/wxorder/check-order-detail', { params })
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
      .post('v3/wxmall/wxorder/cancel-order', params)
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
      .post('v3/wxmall/wxorder/agree-back-order', params)
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
      .post('v3/wxmall/wxorder/refuse-back-order', params)
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
      .post('v3/wxmall/wxorder/confirm-back-order', params)
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
      .get('v3/wxmall/wxorder/get-back-order-lists', { params })
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
      .get('v3/wxmall/wxorder/back-goods-item', { params })
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
    api.post('v3/wxmall/wxorder/set-get-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
