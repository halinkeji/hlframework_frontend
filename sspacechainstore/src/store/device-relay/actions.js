import { api } from 'src/boot/axios'

export function getRelayList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/device-relay', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRelayItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/device-relay/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function deleteRelayData ({ commit }, params) {
  console.log('params', params)
  return new Promise((resolve, reject) => {
    api.delete('v3/device-relay/delete?id=' + params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveRelayData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/device-relay/'
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

export function getRelayListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/device-relay/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRelayClientDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/device-relay/get-relay-client-data-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setRelayClientDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/device-relay/set-relay-client-data-list', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
