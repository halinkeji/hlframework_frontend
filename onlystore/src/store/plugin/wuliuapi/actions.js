import { api } from 'src/boot/axios'

export function getDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('wuliuapi/v1/config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('wuliuapi/v1/config/view?id=' + parseInt(id))
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'wuliuapi/v1/config/'
    apiUrl += parseInt(params.id) > 0 ? 'update?id=' + parseInt(params.id) : 'create'
    const requestType = parseInt(params.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function deleteData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api
      .delete('wuliuapi/v1/config/delete?id=' + id)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getChannelBase ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('wuliuapi/v1/config/base-channel', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLogDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('wuliuapi/v1/log', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getCommonData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('wuliuapi/v1/config/get-common-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function creatOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('wuliuapi/v1/config/creat-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getLogDetail ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api
      .get('wuliuapi/v1/log/view?id=' + id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
