import { api } from 'src/boot/axios'

export function dataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-supplier-type', { params })
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
    let apiUrl = 'v1/erp-supplier-type/'
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

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/erp-supplier-type/view?id=' + parseInt(item)

    api
      .get(apiUrl)
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
    const apiUrl = 'v1/erp-supplier-type/alldel'

    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
