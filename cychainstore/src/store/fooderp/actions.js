import { api } from 'boot/axios'

export function getInListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/food-erp', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getConsumeListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/food-erp/lists', { params })
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
    const apiUrl = 'v3/food-erp/create'
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
// 选择商品组件获取列表
export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/food-erp/inventory-manage', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSalesCountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/food-erp/sale-count', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
