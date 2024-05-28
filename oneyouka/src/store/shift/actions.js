import { api } from 'boot/axios'

export function getOilConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/get-oil-config-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift', { params })
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
    const apiUrl = 'v3/shift/get-shifit-info'
    api.get(apiUrl, { params })
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
    const apiUrl = 'v3/shift/create'
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

export function getSummary ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/summary', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getInvoice ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/invoice', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getLastData () {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/last')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/switch')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setStatus ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/shift/status'
    const requestType = 'put'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getShiftDate ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/list', {
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

export function getRefuelDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/get-refuel-detail', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getCountList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/refuelcount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getConsumList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/consumlist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getConsumCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/consumcount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getCouponList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/couponlist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCouponCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/couponcount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getIntegralList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/integrallist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getIntegralCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/integralcount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getBalanceList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/balancelist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getBalanceCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/balancecount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getKzlsList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/kzlslist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getKzlsCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/kzlscount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getStaffList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/stafflist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getStaffCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/staffcount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilGunList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/oilgunlist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilGunCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/oilguncount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilInfoList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/oilinfolist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilInfoCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/oilinfocount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilInoutList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/oilinoutlist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilInoutCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/oilinoutcount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilCanList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/oilcanlist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getOilCanCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/oilcancount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDebtList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/shift/debtlist', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDebtCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/shift/debtcount', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
