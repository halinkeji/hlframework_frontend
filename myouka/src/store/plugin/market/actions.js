import { api } from 'boot/axios'

export function getConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setConfigData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'market/v1/config/'
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
// 分佣等级
export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/level', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getLevelRecordListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/level/record', { params })
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
    let apiUrl = 'market/v1/level/'
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

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/level/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'market/v1/level/alldel'
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

export function getLevelOption ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('market/v1/level/level-option', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getLevelList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('market/v1/level/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLevelAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/level/lists'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 分佣商
export function getMemberData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/member', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setMemberData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'market/v1/member/'
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

export function getMemberItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/member/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMarketSonMemberData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/member/son-member', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 分佣金额记录
export function getMarketOrderList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/member/market-record', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 分佣提现金额记录
export function getMarketTakeRecordList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/member/take-record', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 佣金提现

export function setTakeAmountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('market/v1/member/take-amount', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 查询佣金提现记录单条
export function getTakeItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/member/view-take', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改上级分佣商

export function updateParentMarketData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('market/v1/member/update-parent', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setFxzxData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'market/v1/goods/'
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

export function getFxzxItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/goods/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取分佣商品佣金单条数据

export function getMarketGoodsAmountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('market/v1/goods/goods-amount', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 修改分佣商等级

export function updateMarketLevelData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('market/v1/member/update-level', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 分佣套餐
export function getPackageListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/package', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setPackageData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'market/v1/package/'
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

export function getPackageItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('market/v1/package/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delPackageAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'market/v1/package/alldel'
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
export function setMarketMember ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'market/v1/member/set-market-member'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function marketBindMember ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'market/v1/member/market-bind-member'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delSonBind ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('market/v1/member/del-son-bind', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
