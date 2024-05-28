import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/oil-turn', {
        params
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
    api.post('v3/oil-turn/create', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function backData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/oil-turn/'
    apiUrl +=
      parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'oil-back'
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
export function upDate ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/return'
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

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/view?id=' + item

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
export function returnOut ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/returnout'
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

export function setTurnData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/setturn'
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
export function getTurnData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/turnlist', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function turnBack ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/turnback'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getTurnReturnData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/turn-return-out-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setTurnReturnData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/set-turn-return'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function turnReturnBack ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/turn-return-back'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getTurnReturnBackList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/get-turn-return-back-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function updateMainInvoice ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/oil-turn/update-invoice', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setDebtTakeOil ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/debt-take-oil'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDebtTakeList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/get-debt-take-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDebtStoreReturnList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/get-debt-store-return-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDebtLinkReturnList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/get-debt-link-return-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setLinkTurnReturn ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/set-link-turn-return'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setLinkLendBack ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/set-link-lend-back'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLinkLendBack ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/get-link-lend-back', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setLinkBorrowOut ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/oil-turn/set-link-borrow-out'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLinkBorrowOut ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/get-link-borrow-out', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getInvoiceDetailData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/oil-turn/get-invoice-detail', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
