import { api } from 'src/boot/axios'

// 获取商品列表
export function getGoodsList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/jfgoods/exchangegoods', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getGoods ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/jfgoods/goods', {
        params: item
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setData ({ dispatch, commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'jfmall/v1/exchang/'
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

export function getShoppingCartList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/exchang', { params: item })
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
    api
      .post('jfmall/v1/exchang/alldel', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function addinvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('jfmall/v1/exchang/addinvoice', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getGoodsSpecData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('jfmall/v1/exchang/get-goods-spec-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function exchangeGoods ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('jfmall/v1/exchang/exchange-goods', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
