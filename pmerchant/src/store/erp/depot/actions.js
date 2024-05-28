import { api } from 'src/boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-depot', {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/erp-depot/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'

    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'

    api[requestType](apiUrl, item)
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
    const apiUrl = 'v1/erp-depot/alldel'
    api
      .post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/erp-depot/view?id=' + item

    api
      .get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-depot/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setTurnBuffer ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/erp-depot/add-buffer', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getBufferListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-depot/buffer-data', {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setTurnData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/erp-depot/set-turn', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function cleanBufferData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/erp-depot/clean-buffer', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delBuffer ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v1/erp-depot/del-buffer'
    api
      .delete(apiUrl, { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getTurnListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-depot/turn-list', {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getDepotGoodsStock ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/erp-depot/get-stock', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
