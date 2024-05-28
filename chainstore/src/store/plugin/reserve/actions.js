import { api } from 'boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('reserve/v1/project', {
        params: item
      })
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
    let apiUrl = 'reserve/v1/project/'
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

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/project/view?id=' + item

    api
      .get(apiUrl)
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
    const apiUrl = 'reserve/v1/project/alldel'
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
export function getReserveProjectList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('reserve/v1/project/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delTime ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/project/deltime'
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

export function getReserveTypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('reserve/v1/type', {
        params: item
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setReserveTypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'reserve/v1/type/'
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

export function getReserveTypeItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/type/view?id=' + item

    api
      .get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delReserveType ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/type/alldel'
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

export function getReserveTypeList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('reserve/v1/type/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getReserveDetailItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/detail/view?id=' + item

    api
      .get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setDetailData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'reserve/v1/detail/'
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

export function getReserveDetailData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('reserve/v1/detail', {
        params: item
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function cancelOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/detail/cancel-order'
    api.post(apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function updateDetailData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('reserve/v1/detail/set-detail', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function verifyReserveLimit ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/detail/verify-reserve-limit'
    api.post(apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function settleOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'reserve/v1/detail/settle-order'
    api.post(apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
