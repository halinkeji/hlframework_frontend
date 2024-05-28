import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reward/indicators/'
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
    api
      .post('v3/reward/indicators/deleteall', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRecordData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/record', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getStoreData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/store', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getRecordList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/record', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getStoreCalendarData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/store-calendar', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getStoreDayData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/store-day', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setStoreDayData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward/indicators/set-store-day', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getStaffLists ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/staff-lists', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/staff-data', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function chaeckUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/chaeck-user', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reward/indicators/'
    apiUrl += parseInt(item.id) > 0 ? 'user-update?id=' + parseInt(item.id) : 'user-create'
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

export function getUserDayData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/indicators/user-day', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserDayData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward/indicators/set-user-day', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward/indicators/deleteuser', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
