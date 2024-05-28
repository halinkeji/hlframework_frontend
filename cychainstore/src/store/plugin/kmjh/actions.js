import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('kmjh/v1/package', { params })
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
    const apiUrl = 'kmjh/v1/package/create'
    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('kmjh/v1/package/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'kmjh/v1/package/alldel'
    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCardListsData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('kmjh/v1/package/card-lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setCardData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('kmjh/v1/package/create-card', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLevelAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/level/lists'
    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getMemberCardData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('kmjh/v1/package/view-card-one', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setMemberData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('kmjh/v1/package/create-member', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
