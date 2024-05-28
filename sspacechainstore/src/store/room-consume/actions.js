import { api } from 'src/boot/axios'

export function getRoomDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-consume/get-room-detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveMaintainData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/save-maintain-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function overMaintainOperate ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/over-maintain-operate', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveConsumeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/save-maintain-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setConsumeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/set-consume-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 直接修改缓存表数据
export function updateConsumeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/update-consume-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 添加至购物车
export function addShoppingCart ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/room-consume/'
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
// 获取购物车列表
export function getShoppingCartList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-consume/cart', { params })
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
    const apiUrl = 'v3/room-consume/alldel'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function placeGoodsShoppingOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/place-goods-shopping-order', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function orderSettle ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/order-settle', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function computeRuleAmount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/compute-rule-amount', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function changeRoomConsume ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/change-room-consume', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveRoomPauseTimeData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/save-room-pause-time-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function overRoomPauseTimeOperate ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/over-room-pause-time-operate', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRoomBookDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/room-consume/get-room-book-detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function bookOrderSettleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/book-order-settle-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getMemberTimeCardData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/time-card-package/get-member-space-time-card', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function overBookRoomSettleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/room-consume/over-book-room-settle-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function revokeRoomConsume ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/room-consume/revoke-room-consume', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setMergeRelation ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/set-merge-relation', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function cancelMergeRelation ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/room-consume/cancel-merge-relation', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
