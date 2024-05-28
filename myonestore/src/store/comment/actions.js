import { api } from 'boot/axios'

export function getItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/comment/get-config', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setItemData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/comment/set-config', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getCommentList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/comment/get-comment-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function updateComment ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/comment/update-comment', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getChartCount ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/comment/get-chart-count', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
