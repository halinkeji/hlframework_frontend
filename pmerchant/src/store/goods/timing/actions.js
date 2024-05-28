import { api } from 'src/boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/timing', { params })
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
    let apiUrl = 'v1/timing/'
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

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/timing/view?id=' + params

    api
      .get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function deleteAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/timing/alldel'
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

export function deleteDetail ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/timing/deldetail'
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

export function getAllData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/timing/alldata', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
