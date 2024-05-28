import { api } from 'boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('receipt/v1/title', {
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
    let apiUrl = 'receipt/v1/title/'
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
    const apiUrl = 'receipt/v1/title/view?id=' + item

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
    const apiUrl = 'receipt/v1/title/alldel'
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
export function getTitleList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'receipt/v1/title/lists'
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

export function getInvoiceList
({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('receipt/v1/record', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getOpenInvoiceList
({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('receipt/v1/record/openlist', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getReceiptList
({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('receipt/v1/record/receiptlist', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setRecordData
({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'receipt/v1/record/setrecord'
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
export function getRecordItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'receipt/v1/record/view?id=' + item

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
export function setRecordInfo
({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'receipt/v1/record/update?id=' + parseInt(item.id)
    api
      .put(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
