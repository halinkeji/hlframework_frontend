import { api } from 'boot/axios'

// 计次
export function getCountListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('zzyx/v1/config/count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 计时
export function getTimingListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('zzyx/v1/config/timing', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 优惠券
export function getCouponListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('zzyx/v1/config/coupon', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 新增转赠设置
export function setConfigData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'zzyx/v1/config/create'
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

// 转赠记录
export function getRecordListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('zzyx/v1/record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
