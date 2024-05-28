import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('bmtk/v1/bmtk', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getItemData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'bmtk/v1/bmtk/view?id=' + parseInt(id)

    api.get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'bmtk/v1/bmtk/'
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
    const apiUrl = 'bmtk/v1/bmtk/delete?id=' + parseInt(id)

    api.delete(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getDetailList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('bmtk/v1/bmtk/detail', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getInvoiceView ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('bmtk/v1/bmtk/invoice', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function sendStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('bmtk/v1/bmtk/sendstatus', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
