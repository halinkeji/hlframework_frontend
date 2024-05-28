
import { api } from 'src/boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('jfmall/v1/evaluation/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'jfmall/v1/evaluation/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getChartCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('jfmall/v1/evaluation/get-chart-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
