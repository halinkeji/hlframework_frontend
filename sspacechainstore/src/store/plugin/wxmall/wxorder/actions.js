import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wxmall/v1/wxorder', { params: item })
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
      .get('wxmall/v1/wxorder/view?id=' + itemId)
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
    let apiUrl = 'wxmall/v1/wxorder/'
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
    let apiUrl = 'wxmall/v1/wxorder/delete?id='
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
      .post('wxmall/v1/wxorder/confirm-order', params)
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
      .post('wxmall/v1/wxorder/set-order-delivery', params)
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
      .get('wxmall/v1/wxorder/check-order-detail', { params })
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
      .post('wxmall/v1/wxorder/cancel-order', params)
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
      .post('wxmall/v1/wxorder/agree-back-order', params)
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
      .post('wxmall/v1/wxorder/refuse-back-order', params)
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
      .post('wxmall/v1/wxorder/confirm-back-order', params)
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
      .get('wxmall/v1/wxorder/get-back-order-lists', { params })
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
      .get('wxmall/v1/wxorder/back-goods-item', { params })
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
    api.post('wxmall/v1/wxorder/set-get-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
