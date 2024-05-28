import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/config', { params: item })
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
    let apiUrl = 'partner/v1/config/'
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

export function getRecordList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/config/record', { params: item })
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
    const apiUrl = 'partner/v1/config/delete?id=' + item
    api
      .delete(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getConfigset ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/config/configset', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMember ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/member', { params: item })
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
    let apiUrl = 'partner/v1/member/'
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
export function getMemberItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/member/view?id=' + itemId)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delMemberrData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('partner/v1/member/deleteall', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function checkMemberrData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('partner/v1/member/check', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMemberLink ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/link', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getIncome ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/income', { params: item })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function checkMemberLinkData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('partner/v1/link/check', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setMemberLinkData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'partner/v1/link/'
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
export function delMemberLinkData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('partner/v1/link/deleteall', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMemberTotal ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/member/total?id=' + itemId)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 合伙人等级
export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/level', { params })
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
      .get('partner/v1/level/record', { params })
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
    let apiUrl = 'partner/v1/level/'
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
      .get('partner/v1/level/view', { params })
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
    const apiUrl = 'partner/v1/level/alldel'
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
      .post('partner/v1/level/level-option', item)
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
      .post('partner/v1/level/lists', item)
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
    const apiUrl = 'v1/level/lists'
    api.post(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 提现金额记录
export function getPartnerTakeRecordList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('partner/v1/member/take-record', { params })
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
      .get('partner/v1/member/view-take', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setTakeAmountData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('partner/v1/member/take-amount', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
