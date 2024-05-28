import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('wxmall/v1/wxgoods', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getGoodsLists ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('wxmall/v1/wxgoods/lists', { params })
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
    let apiUrl = 'wxmall/v1/wxgoods/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxmall/v1/wxgoods/view'
    api
      .get(apiUrl, { params })

      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function verifyGoods ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxmall/v1/wxgoods/verify-goods'
    api.get(apiUrl, { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxmall/v1/wxgoods/alldel'
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
