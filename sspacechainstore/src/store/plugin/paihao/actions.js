import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('paihao/v1/project', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDetailData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('paihao/v1/project/paihao-lists', { params })
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
    let apiUrl = 'paihao/v1/project/'
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

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('paihao/v1/project/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'paihao/v1/project/alldel'
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

export function setListsData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'paihao/v1/project/create-lists'
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
export function setPrinterPaihao ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('paihao/v1/project/printer', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getPrinterList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/printer/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function updateListsData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'paihao/v1/project/update-lists'
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
