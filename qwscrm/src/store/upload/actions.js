
import { api } from 'boot/axios'

export function files ({ commit }, formData) {
  return new Promise((resolve, reject) => {
    api.post('/v1/file/file-data', formData)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getImageList ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/file/image-index', {
        params: payload
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function image ({ commit }, formData) {
  return new Promise((resolve, reject) => {
    api
      .post('/v1/file/images', formData)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setImageData ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api
      .put('v1/file/image-updata', payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getGroupList ({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/file/group-index')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setGroupData ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    const urlType = parseInt(payload.id) > 0 ? 'group-update?id=' + parseInt(payload.id) : 'group-create'
    const requestType = parseInt(payload.id) > 0 ? 'put' : 'post'
    api[requestType](`v1/file/${urlType}`, payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delGroupData ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api
      .delete(`v1/file/group-delete?id=${payload}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
