import { api } from 'src/boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/add-duration', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addShoppingCart ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/add-duration/'
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

export function delList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/add-duration/allput'

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

export function putnumber ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/add-duration/putnumber', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addinvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/add-duration/addinvoice', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
