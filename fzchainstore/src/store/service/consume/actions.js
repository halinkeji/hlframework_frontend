import { api } from 'boot/axios'

// 消费收银商品分类
export function getTypeData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/consume/lists'

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

// 获取商品列表
export function getSpecification ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/consume/home', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取商品列表
export function getGoodsList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/consume', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取购物车列表
export function getShoppingCartList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/consume/cart', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取挂单列表
export function getHangUpList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/consume/hang', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取商品套餐列表
export function getPackage ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/consume/package', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 添加至购物车
export function addShoppingCart ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/consume/'
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

// 修改购物车商品数量
export function addNumber ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/consume/number'
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

export function addCodeCart ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/consume/code'
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

// 订单挂起
export function addhang ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/consume/addhang'

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

// export function delData({ commit }, item) {
//   return new Promise((resolve, reject) => {
//     var apiUrl = 'v3/consume/delete'
//     apiUrl += parseInt(item.id) > 0 ? "/" + parseInt(item.id) : ""
//     api.delete(apiUrl, item)
//       .then((response) => {
//         resolve(response)
//       })
//       .catch((error) => { reject(error) })
//   })
// }

// 删除单条/清除购物车
export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/consume/alldel'

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

// 删除挂单单条
export function delhang ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/consume/delhang'

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

// 消费收银 生成单据等
export function addinvoice ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume/addinvoice', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setPromotion ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/consume/promotion', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
