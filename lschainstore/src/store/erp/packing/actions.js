import { api } from 'src/boot/axios'

export function getPackageListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/erp-packing/lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/erp-packing', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDetailData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-packing/item', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function splitBoxData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-packing/split-box-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getWuliuData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/erp-packing/get-wuliu-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setWuliuData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-packing/set-wuliu-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
