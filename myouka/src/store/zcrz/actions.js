import { api } from 'boot/axios'

// 获取分类带分页
export function getTypeListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/zcrz/type', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取分类无分页
export function getTypeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/zcrz/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取专车分类单条数据
export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/zcrz/type-view?id=' + parseInt(id)
    api.get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 新增修改专车分类数据
export function addData ({ commit }, item) {
  console.log(item)
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/zcrz/'
    apiUrl += parseInt(item.id) > 0 ? 'type-update?id=' + parseInt(item.id) : 'type-create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 删除专车分类数据
export function delData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/zcrz/type-delete?id=' + parseInt(id)

    api.post(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 获取认证信息带分页
export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/zcrz', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取专车认证信息单条数据
export function getItemData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/zcrz/view?id=' + parseInt(id)
    api.get(apiUrl)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 新增修改专车认证信息数据
export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/zcrz/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

// 删除专车认证信息数据
export function delInfoData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/zcrz/info-delete?id='
    apiUrl += (id)
    api.post(apiUrl, id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getZcrzPrice ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/zcrz/oil-price', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setZcrzPrice ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/zcrz/set-oil-price', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function judgeOnlyMember ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/zcrz/judge-only-member', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
