import { api } from 'boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-label', { params: item })
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
    api
      .get('v3/reward-label/view?id=' + itemId)
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
    let apiUrl = 'v3/reward-label/'
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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-label/deleteall', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getGoodsLabel ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-label/goodslabel', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setGoodsLabel ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-label/setgoods', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getGoodsConsume ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-label/getgoods', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getUserLabelList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-label/userlist', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getUserLabelRecord ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward-label/userrecord', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLabelCheck ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward-label/labelcheck')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
