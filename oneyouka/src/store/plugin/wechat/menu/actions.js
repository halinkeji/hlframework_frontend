import { api } from 'src/boot/axios'

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('wechat/v1/menu')
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
      .post('wechat/v1/menu/create', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
