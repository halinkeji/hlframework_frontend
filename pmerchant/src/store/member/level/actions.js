import { api } from 'src/boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/level', { params })
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
      .get('v1/level/view?id=' + itemId)
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
    let apiUrl = 'v1/level/'
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
    let apiUrl = 'v1/level/delete?id='
    apiUrl += item
    api.delete(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/level/lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getManagement ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/level/management', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setManagement ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/level/setmanagement', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delManagement ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/level/delmanagement', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSwitch ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/level/switch', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setSwitch ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/level/setswitch', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getUpgrade ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/level/upgrade', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setUpgradeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/level/setupgrade', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delUpgrade ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/level/delupgrade', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDefaultLevelOne ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/level/get-default-level-one', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
