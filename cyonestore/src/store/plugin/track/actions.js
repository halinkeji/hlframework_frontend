import { api } from 'boot/axios'

export function getMemberListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('track/v1/record/member', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getTrackListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('track/v1/record', {
        params: item
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setTrackData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'track/v1/record/'
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

export function delTrack ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'track/v1/record/alldel'
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
export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'track/v1/record/view?id=' + item

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

export function getStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('track/v1/setting')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'track/v1/setting/status'
    const requestType = 'put'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
