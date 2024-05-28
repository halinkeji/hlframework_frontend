import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-direct-allocation', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function createAllocationOrderData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-direct-allocation/create-allocation-order-data', params)
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
    const apiUrl = 'v3/erp-direct-allocation/view?id=' + parseInt(itemId.id)
    api.get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function editBufferData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-direct-allocation/edit-buffer-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function changeBufferQuantity ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-direct-allocation/change-buffer-quantity', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function changeAllocationOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-direct-allocation/change-allocation-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
