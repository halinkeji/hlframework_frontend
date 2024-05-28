import { api } from 'boot/axios'

// 业务消费报表
export function getChartsServiceData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/service', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 充次
export function getChartsAddCountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/add-count', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 扣次
export function getChartsDeductCountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/deduct-count', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 充时
export function getChartsAddTimingData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/add-timing', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 扣时
export function getChartsDeductTimingData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/deduct-timing', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 会员充值报表
export function getChartsRechargeMoneyData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/recharge-money', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getChartsMemberGiveData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/member-give', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 赠送会员
export function getChartsGiveBalanceData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/give-balance', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 消费
export function getChartsConsumeBalanceData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/consume-balance', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getChartsGoodsData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/goods', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 充次、扣次
export function getChartsCountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/count', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 充时、扣时
export function getChartsTimingData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/timing', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 记录
export function getChartsBalanceData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/balance', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getChartsIntegralData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/integral', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getChartsAddIntegralData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/add-integral', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getChartsConsumeIntegralData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/charts/consume-integral', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
