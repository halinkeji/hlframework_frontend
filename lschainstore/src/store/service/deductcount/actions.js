import { api } from 'boot/axios'
// 获取会员次卡列表
export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/deduct-count', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 计次消费 生成单据等
export function addinvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-count/addinvoice', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 计次消费 生成单据等
export function oneCardCheck ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-count/check', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 计次消费 次卡延期等
export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-count/delay', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getDelaylist ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-count/delaylist', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCheckCountCard ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/deduct-count/count-card', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 计次消费 生成单据等
export function timecardcheck ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-count/check', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 获取次卡限制周期可用规则
export function getLimitCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/deduct-count/limit-count', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
