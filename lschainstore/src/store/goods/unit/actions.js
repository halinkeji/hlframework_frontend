import { api } from 'boot/axios'

export function getGoodsUnitList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/goods-unit', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/goods-unit/'
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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/goods-unit/alldel'

    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/goods-unit/view?id=' + item

    api
      .get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
