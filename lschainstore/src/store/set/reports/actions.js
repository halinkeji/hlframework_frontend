import { api } from 'boot/axios'

export function geInvoiceTyps ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reports', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setReportsXls ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reports/exports-xls', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
