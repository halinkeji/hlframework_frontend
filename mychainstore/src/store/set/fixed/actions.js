import { api } from 'src/boot/axios'

export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/fixed-money', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/fixed-money/view?id=' + parseInt(item.id)

    api.get(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/fixed-money/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/fixed-money/alldel'

    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
