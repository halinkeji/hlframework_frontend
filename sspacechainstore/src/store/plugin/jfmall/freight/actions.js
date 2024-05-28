import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/freight', { params: item })
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
    api
      .get('jfmall/v1/freight/view?id=' + itemId)
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
    let apiUrl = 'jfmall/v1/freight/'
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
export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'jfmall/v1/freight/alldel'
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
export function getFreightData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('jfmall/v1/freight/lists')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
