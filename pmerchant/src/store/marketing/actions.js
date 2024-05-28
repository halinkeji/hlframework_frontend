import { api } from 'src/boot/axios'

export function getMarketingConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-marketing-config', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setMarketingConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/marketing/set-marketing-config', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTypeList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-type-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getTypeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-type-item', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delTypeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/marketing/del-type-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setTypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/marketing/'
    apiUrl += parseInt(item.id) > 0 ? 'type-update?id=' + parseInt(item.id) : 'type-create'
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
export function getTypeAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-type-all-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getUserList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-user-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setUserData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/marketing/'
    apiUrl += parseInt(item.id) > 0 ? 'user-update?id=' + parseInt(item.id) : 'user-create'
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

export function getUserData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-user-item', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delUserData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/marketing/del-user-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserWithdrawalRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-user-withdrawal-record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function withdrawOrderCheck ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/marketing/withdraw-order-check', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function withdrawOrderRefuse ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/marketing/withdraw-order-refuse', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserRelationRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-user-relation-record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserRewardRecord ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-user-reward-record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserAmountCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-user-amount-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getWithdrawAmountCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-withdraw-amount-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRewardAmountCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/marketing/get-reward-amount-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
