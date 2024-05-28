import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reserve-config', {
        params
      })
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
    let apiUrl = 'v3/reserve-config/'
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

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/reserve-config/get-item'
    api.get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/reserve-config/alldel'
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
export function getReserveProjectList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reserve-config/lists', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delTime ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/reserve-config/deltime'
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

export function getReserveTypeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reserve-type', {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setReserveTypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reserve-type/'
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

export function getReserveTypeItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/reserve-type/view?id=' + item

    api
      .get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delReserveType ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/reserve-type/alldel'
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

export function getReserveTypeList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reserve-type/lists', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getReserveDetailItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/reserve-detail/view?id=' + item

    api
      .get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setDetailData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reserve-detail/'
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

export function getReserveDetailData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reserve-detail', {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getDateScopeProject ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reserve-config/current-lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getReserveConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reserve-detail/config-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getCurrentReserveDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-detail/curren-detail', {
      params
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getWeekReserveCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-detail/get-week-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function reservePendingOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/reserve-detail/pending-order', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
