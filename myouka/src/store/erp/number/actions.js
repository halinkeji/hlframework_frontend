import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDepotGoodsData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/depot', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getNumber ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/number', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getWarningRules ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/rules', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setNumber ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/erp-number/setnumber'
    const requestType = 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTotal ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/total', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getSale ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/salelist', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getChange ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/listc', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getConsum ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/listcon', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getCostPice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/goodsin', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getReturn ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/listret', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getConsumeReturn ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/consume-return', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getGoodsDepotData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/goods-depot', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getDetailData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/inquire-detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getTurnDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/turn-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
