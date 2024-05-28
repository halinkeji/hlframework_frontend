import { api } from 'boot/axios'

export function getRuleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hbyx/v1/rule', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRuleItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('hbyx/v1/rule/view?id=' + itemId)
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
    let apiUrl = 'hbyx/v1/rule/'
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
export function delRuleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('hbyx/v1/rule/all-del', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getActivityData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('hbyx/v1/activity', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getActivityItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('hbyx/v1/activity/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setActivityData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'hbyx/v1/activity/'
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
export function delActivityData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('hbyx/v1/activity/all-del', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRecordListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('hbyx/v1/record', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
