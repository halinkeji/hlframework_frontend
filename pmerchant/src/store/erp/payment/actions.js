import { api } from 'src/boot/axios'

export function getReceiptList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-payment', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSupplier () {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-payment/page')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/erp-payment/create'
    const requestType = 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getInvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-payment/invoice', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
