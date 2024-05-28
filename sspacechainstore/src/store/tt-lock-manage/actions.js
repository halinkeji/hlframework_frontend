import { api } from 'src/boot/axios'

export function getConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/ttlock-manage/get-config-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/ttlock-manage/set-config-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTtlockDoorLockList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/ttlock-manage/get-ttlock-door-lock-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function openTtlockDoor ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/ttlock-manage/open-ttlock-door', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function lockTtlockDoor ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/ttlock-manage/lock-ttlock-door', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
