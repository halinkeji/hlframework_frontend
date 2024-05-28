import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('csjz/v1/csjz', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getItemData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'csjz/v1/csjz/view?id=' + parseInt(id)

    api.get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'csjz/v1/csjz/'
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

export function delData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'csjz/v1/csjz/delete?id=' + parseInt(id)

    api.delete(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getDetailList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('csjz/v1/csjz/detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getInvoiceView ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('csjz/v1/csjz/invoice', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function sendStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('csjz/v1/csjz/sendstatus', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
