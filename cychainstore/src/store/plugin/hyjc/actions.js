import { api } from 'boot/axios'

// 存取分类
export function getTypeListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyjc/v1/type', { params })
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
    let apiUrl = 'hyjc/v1/type/'
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

export function getTypeItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyjc/v1/type/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delTypeAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hyjc/v1/type/alldel'
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
export function getTypeLists ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('hyjc/v1/type/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 存取记录
export function getRecordListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyjc/v1/record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setRecordData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'hyjc/v1/record/'
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

export function getRecordItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyjc/v1/record/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delRecordAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hyjc/v1/record/alldel'
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

// 存取详情
export function getDetailListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyjc/v1/detail', { params })
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
    let apiUrl = 'hyjc/v1/detail/'
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

export function getDetailItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyjc/v1/detail/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delDetailAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hyjc/v1/detail/alldel'
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
