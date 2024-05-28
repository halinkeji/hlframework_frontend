import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reward-position', { params })
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
      .get('v3/reward-position/view?id=' + itemId)
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
    let apiUrl = 'v3/reward-position/'
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
    api
      .post('v3/reward-position/deleteall', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getUser ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-user', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reward-user/'
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

export function getUserDataLists ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-user/lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-user/adduse', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-user/deleteall', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getUserList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-user/userlist', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function openCardRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-record', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function consumRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-record/consum', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getUserItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-user/view?id=' + itemId)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function oilConsumRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-record/oilconsum', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function userCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-record/usercount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setRecord ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-record/setrecord', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRecordList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-record/recordlists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRewardCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reward-user/get-reward-count', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAllPosition ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reward-position/all-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAllStaff ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reward-user/get-all-staff', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
