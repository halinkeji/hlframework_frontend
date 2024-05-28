import { api } from 'src/boot/axios'

export function getList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-customer-group', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getGroup ({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-customer-group/data')
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
    let apiUrl = 'v1/erp-customer-group/'
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

export function getItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/erp-customer-group/view?id=' + parseInt(item)

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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/erp-customer-group/delete?id='
    apiUrl += (item)
    api.delete(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
