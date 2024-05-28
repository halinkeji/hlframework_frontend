import { api } from 'boot/axios'

export function getList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('checkin/v1/checkin/', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'checkin/v1/checkin/view?id=' + parseInt(id)

    api.get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setRule ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'checkin/v1/checkin/'
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

export function delRule ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'checkin/v1/checkin/alldel'

    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCheckinList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('checkin/v1/checkin/signin', { params })
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
    api.get('checkin/v1/checkin/switch')
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
    const apiUrl = 'checkin/v1/checkin/status'
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
