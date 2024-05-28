import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/food-lists', { params })
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
    let apiUrl = 'v3/food-lists/'
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

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/food-lists/alldel'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delSpecMain ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/food-lists/delmain'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delSpecSon ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/food-lists/delson'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delPackagesDetail ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/food-lists/delpackages'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delPanicBuying ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/food-lists/del-panic-buying'
    api.post(apiUrl, item)
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
      .get('v3/food-lists/view', { params })
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
      .get('v3/food-type', { params })
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
    let apiUrl = 'v3/food-type/'
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
    api.get('v3/food-type/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delAllType ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/food-type/alldel'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getTypeList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/food-type/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMemberLevelPriceList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/food-lists/price', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getPrinterList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/food-lists/printer', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getOrderFoodList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/food-lists/order-food-list', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getOrderFoodData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/food-lists/order-food-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
