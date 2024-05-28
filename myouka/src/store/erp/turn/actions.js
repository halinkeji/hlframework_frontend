import { api } from 'boot/axios'

export function getTurnData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/erp-turn', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getBufferData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-turn/buttfer', { params })
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
    const apiUrl = 'v3/erp-turn/view?goodsinventoryin_id=' + item
    api.get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setTurnData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/erp-turn/'
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

export function setBuffData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/erp-turn/addbuf', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delBufferData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.delete('v3/erp-buffer/delete', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function cleanBufferlist ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-turn/alldel', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delTurnData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/erp-turn/alldel'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function confirmTurn ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/erp-turn/confirm-turn', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
