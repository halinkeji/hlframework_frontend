import { api } from 'src/boot/axios'

export function getChargePackageList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/time-card-package', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getChargePackageItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/time-card-package/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function deleteChargePackageData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.delete('v3/time-card-package/delete', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveChargePackage ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/time-card-package/'
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
export function getChargePackageListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/time-card-package/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getSpaceTimeCardRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/time-card-package/get-space-time-card-record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getMemberSpaceTimeCard ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/time-card-package/get-member-space-time-card', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
