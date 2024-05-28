import { api } from 'src/boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('apisupplier/v1/manage', { params })
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
    let apiUrl = 'apisupplier/v1/manage/'
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

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api.get('apisupplier/v1/manage/view?id=' + itemId)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getEnumData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('apisupplier/v1/manage/enum')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('apisupplier/v1/manage/delete-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function runApiRequest ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('apisupplier/v1/manage/run-api-request', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getLogList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('apisupplier/v1/log', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getLogDetail ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('apisupplier/v1/log/view?id=' + id)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
