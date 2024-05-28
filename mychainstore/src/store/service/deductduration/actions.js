import { api } from 'src/boot/axios'
// 获取会员次卡列表
export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/deduct-duration', { params: item })
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
      .post('v3/deduct-duration/addinvoice', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 计次消费 生成单据等
export function timecardcheck ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-duration/check', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function putnumber ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-duration/putnumber', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function addinvoiced ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/deduct-duration/addinvoiced', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
