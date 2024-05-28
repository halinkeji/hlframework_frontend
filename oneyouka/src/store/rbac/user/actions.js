import { api } from 'boot/axios'

export function getUserList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/user', {
      params
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/user'
    apiUrl += parseInt(item.id) > 0 ? '/update?id=' + parseInt(item.id) : '/create'
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

export function getUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/user/view?id=' + item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.delete(`v3/user/delete?id=${item}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function roleInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/user/role', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getUserAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/user/lists', {
      params
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserExtend ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/user/get-user-extend', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserExtend ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/user/set-user-extend', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/user/get-user-info', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/user/set-user-info', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
