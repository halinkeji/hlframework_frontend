import { api } from 'src/boot/axios'

export function getGoodsTagList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/goods-tag', { params })
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
    let apiUrl = 'v3/goods-tag/'
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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/goods-tag/alldel'

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

export function getItemData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/goods-tag/view?id=' + item

    api
      .get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getBindListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/goods-tag/bind-list'

    api
      .get(apiUrl, { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setBindData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/goods-tag/set-bind'

    api
      .post(apiUrl, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delBindData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/goods-tag/del-bind-data'

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

export function getTagAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/goods-tag/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTagData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/goods-tag/data', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
