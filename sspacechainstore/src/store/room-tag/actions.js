import { api } from 'src/boot/axios'

export function getTagList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-tag', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTagItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/room-tag/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function deleteTagData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.delete('v3/room-tag/delete', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveTagData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/room-tag/'
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

export function getTagListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/room-tag/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
