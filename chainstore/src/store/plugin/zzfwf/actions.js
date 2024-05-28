import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('zzfwf/v1/goods', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('zzfwf/v1/goods/set-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('zzfwf/v1/goods/set-all-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('zzfwf/v1/record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
