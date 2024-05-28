import { api } from 'boot/axios'

// 营销规则
export function getRuleListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyryx/v1/rule', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setRuleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'hyryx/v1/rule/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestRule = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestRule](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRuleItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyryx/v1/rule/view', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delRuleAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'hyryx/v1/rule/alldel'
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

export function getAllData ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api.get('v1/level/lists')
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getHyryxRuleLists ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('hyryx/v1/rule/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 营销记录
export function getRecordListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hyryx/v1/record', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 会员日营销统计分析
export function getHyryxChartsData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('hyryx/v1/charts/charts', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
