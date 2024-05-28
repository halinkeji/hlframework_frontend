import { api } from 'src/boot/axios'
// 获取正在计时
export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('/jskm/v1/jskm/lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function deleteData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.delete('/jskm/v1/jskm/delete', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
