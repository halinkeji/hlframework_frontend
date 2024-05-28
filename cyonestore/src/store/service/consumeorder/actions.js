import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/desk-position', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDeskItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/desk-position/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDeskLinkData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/consume-order/get-desk-link-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getFoodItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/food-lists/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setDeskLinkData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/consume-order/'
    apiUrl +=
      parseInt(item.id) > 0
        ? 'update-link?id=' + parseInt(item.id)
        : 'create-link'
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
export function setDeskCarData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/consume-order/'
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
export function setDeskCarMember ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume-order/update-car', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function placeAnOrder ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume-order/place-an-order', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function orderSetData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume-order/settle', item)
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
      .get('v3/consume-order/view', { params })
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
    const apiUrl = 'v3/desk-position/alldel'
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
export function setAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/desk-position/setall'
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
export function getTypeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/desk-type', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setTypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/desk-type/'
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
export function getTypeItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/desk-type/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delAllDeskCar ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/consume-order/alldel'
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
export function getDeskList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/desk-position/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDeskCarList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/consume-order/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getUserList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/consume-order/user-lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setPrinterCheck ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/consume-order/printer', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getCarItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/consume-order/view-car', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function clearCart ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume-order/clear-cart', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function clearDesk ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume-order/clear-desk', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getFoodTypeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/food-type/lists', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDeskSettleDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume-order/get-desk-settle-detail', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
