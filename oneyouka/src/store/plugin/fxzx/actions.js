import { api } from 'boot/axios'

export function getConfigData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/config', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setConfigData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'fxzx/v1/config/'
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
// 分销等级
export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/level', { params })
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
    let apiUrl = 'fxzx/v1/level/'
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
export function getGoodsListsData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/level/goods-lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/level/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'fxzx/v1/level/alldel'
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

export function getLevelOption ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/level/level-option', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getLevelList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/level/lists', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getLevelAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'v3/level/lists'
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
// 分销商
export function getMemberData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/member', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setMemberData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'fxzx/v1/member/'
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

export function getMemberItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/member/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getFxzxSonMemberData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/member/son-member', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 分销订单
export function getFxzxOrderList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/order', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 查分销单条详情
export function getFxzxOrderView ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/order/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 新增分销记录(待删除)

export function setFxzxRecordData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/order/create', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 分销提现金额记录
export function getFxzxTakeRecordList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/member/take-record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 佣金提现
export function setTakeAmountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/member/take-amount', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 查询佣金提现记录单条
export function getTakeItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/member/view-take', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 修改上级分销商

export function updateParentFxzxData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/member/update-parent', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setFxzxData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'fxzx/v1/goods/'
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

export function getFxzxItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('fxzx/v1/goods/view-item', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取分销商品佣金单条数据(商品列表)
export function getFxzxGoodsAmountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/goods/goods-amount', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 修改分销商等级
export function updateFxzxLevelData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/member/update-level', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 分销汇总
export function getFxzxchartsData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/charts/charts', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getFxzxGoodsList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('fxzx/v1/goods/goods-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function verifyGoods ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('fxzx/v1/goods/verify-goods', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delGoodsAll ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('fxzx/v1/goods/alldel', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 分销等级
export function updateFxzxGoods ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('fxzx/v1/goods/update-set', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setMarketMember ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'fxzx/v1/member/set-market-member'
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
    const apiUrl = 'fxzx/v1/member/market-bind-member'
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
    api.post('fxzx/v1/member/del-son-bind', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
