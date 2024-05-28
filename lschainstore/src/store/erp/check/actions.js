import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-check', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/erp-check/view?id=' + parseInt(itemId.id)
    api.get(apiUrl)
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
    let apiUrl = 'v3/erp-check/'
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

export function addGoodsInBuffer ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-check/add-goods-in-buffer', params)
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
      .post('v3/erp-check/edit-buffer-data', item)
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
    api.delete('v3/erp-check/delete?id=' + item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function editCheck ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-check/edit-check', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function changeCheckOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-check/change-check-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-check/alldel')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setBuffData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-check/addbuf', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getBufferData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-check/buttfer', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function editCheckButtfer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-check/addcheck', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCheckData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-check/check', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setPosting ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-check/setposting', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function upload ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-check/upload', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
