import { api } from 'src/boot/axios'

export function getList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/clothing-archives', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/clothing-archives/'
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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/clothing-archives/alldel'
    api
      .post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/clothing-archives/view?id=' + item
    api
      .get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getLists ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/clothing-archives/lists', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/clothing-archives/archives', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function uploadArchives ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/clothing-archives/uploadarchives'
    api
      .post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getListDatas ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/clothing-archives/list-data', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
