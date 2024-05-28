import { api } from 'boot/axios'

// 获取单位列表
export function getUnitDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('clbank/v1/unit', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 删除单位
export function deleteData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'clbank/v1/unit/delete-data'
    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 新增单位
export function setUnitData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'clbank/v1/unit/'
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
// 获取单位单条
export function getUnitItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('clbank/v1/unit/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取规则列表
export function getRuleDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('clbank/v1/rule', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 删除规则
export function deleteRuleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'clbank/v1/rule/delete-data'
    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 新增规则
export function setRuleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'clbank/v1/rule/'
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
// 获取规则单条
export function getRuleItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('clbank/v1/rule/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取基础配置
export function getBaseConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('clbank/v1/record/get-base-config', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 新增记录
export function addRecordData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('clbank/v1/record/create', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 获取记录列表
export function getRecordData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('clbank/v1/record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取记录详情
export function getRecordDetail ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('clbank/v1/record/get-record-detail', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveTakeInterest ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'clbank/v1/record/save-take-interest'
    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveTakeInitWeight ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'clbank/v1/record/save-take-init-weight'
    api.post(apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取统计数据
export function getChartData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('clbank/v1/record/get-chart-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
