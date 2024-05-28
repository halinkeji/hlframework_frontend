import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/material-manage', { params })
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
    let apiUrl = 'v3/material-manage/'
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

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/material-manage/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function batchMaterialDelete ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/material-manage/batch-delete'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setInDepotData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/material-manage/set-in-depot', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMaterialList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/material-manage/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getInDepotRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/material-manage/get-in-depot-record', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getStockData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/material-manage/get-stock-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getSellRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/material-manage/get-sell-record', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
