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
