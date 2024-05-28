import { api } from 'src/boot/axios'

export function getRuleList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/charge-rule', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRoomGroupItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/charge-rule/view?id=' + itemId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function deleteChargeRuleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.delete('v3/charge-rule/delete', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveChargeRule ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/charge-rule/'
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
export function getChargeRuleList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/charge-rule/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
