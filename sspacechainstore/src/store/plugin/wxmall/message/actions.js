
import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wxmall/v1/message', { params: item })
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
      .get('wxmall/v1/message/view?id=' + itemId)
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
    let apiUrl = 'wxmall/v1/message/'
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
    let apiUrl = 'wxmall/v1/message/delete?id='
    apiUrl += item
    api
      .delete(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wxmall/v1/message/lists', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getType ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wxmall/v1/message/type', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
