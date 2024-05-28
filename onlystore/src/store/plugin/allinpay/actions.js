import { api } from 'src/boot/axios'

export function getItem ({ commit }) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'allinpay/v1/set'
    api.get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'allinpay/v1/set/create'
    const requestType = 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function createMember ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/create-member', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function sendSmsCode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/send-sms-code', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function bindPhone ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/bind-phone', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setRealName ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/set-real-name', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSignContract ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/get-sign-contract', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function bindBankCard ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/bind-bank-card', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function withdrawBalance ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('allinpay/v1/set/withdraw-balance', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function withdrawOperate ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/withdraw-operate', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('allinpay/v1/record', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getLogData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('allinpay/v1/record/lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAccountFile ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('allinpay/v1/set/account-file', { params })
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
    api.get('allinpay/v1/record/user-lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function sendOrderSignalAgentPay ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('allinpay/v1/set/batch-agent', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
