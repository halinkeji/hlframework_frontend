import { api } from 'src/boot/axios'

export function getRoomGroupList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-group', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRoomGroupItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/room-group/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function deleteRoomGroupData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.delete('v3/room-group/delete', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveRoomGroup ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/room-group/'
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

export function getRoomDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-table', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRoomItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/room-table/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function saveRoomData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/room-table/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
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

export function deleteRoomData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.delete('v3/room-table/delete', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRoomGroupDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-group/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getRoomTableDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-table/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveMoreRoomData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-table/save-more-room-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRoomDeviceData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-table/get-room-device-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setRoomDeviceData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-table/set-room-device-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRoomLogDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-table/get-room-log-data-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
