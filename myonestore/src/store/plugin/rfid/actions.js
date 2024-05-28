import { api } from 'src/boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('rfid/v1/setting')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'rfid/v1/setting/'
    apiUrl +=
      parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getSetSwitch ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('rfid/v1/setting/setswitch')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
