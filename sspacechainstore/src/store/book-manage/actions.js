import { api } from 'src/boot/axios'

export function getBookConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-book/get-book-config-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setBookConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-book/set-book-config-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getBookManageConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-book/get-book-manage-config', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getWeekReserveCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-book/get-week-reserve-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCurrentReserveDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-book/get-current-reserve-detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function openRoomConsumeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-book/open-room-consume-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getBookReocrdList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-book/get-book-reocrd-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function cancelBookOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-book/cancel-book-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
