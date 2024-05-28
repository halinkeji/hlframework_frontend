import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('sms/v1/sms', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('sms/v1/sms/view?id=' + itemId)
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
    let apiUrl = 'sms/v1/sms/'
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

export function addSet ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('sms/v1/sms/addset', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getSmsSet ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('sms/v1/sms/smsset', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function addTel ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'sms/v1/sms/'
    apiUrl += parseInt(item.id) > 0 ? 'updatedtel?id=' + parseInt(item.id) : 'addtel'
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
export function getTemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('sms/v1/sms/template')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'sms/v1/sms/delete?id=' + parseInt(item.id)

    api
      .delete(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getMemberData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('sms/v1/sms/member', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setCareData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('sms/v1/sms/care', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function sendSms ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('sms/v1/sms/send', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
