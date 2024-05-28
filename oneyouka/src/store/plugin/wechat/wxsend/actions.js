import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wechat/v1/wxsend/template'

    api
      .get(apiUrl, item)
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
    api
      .post('wechat/v1/wxsend/addtem', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getTaskData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = api
      .get('wechat/v1/wxsend/task', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
