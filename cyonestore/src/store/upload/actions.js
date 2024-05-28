
import { api } from 'src/boot/axios'

export function getImageList ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/file/image-index', {
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
      .post('/v3/file/images', formData)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setImageData ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api
      .put('v3/file/image-updata', payload)
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
      .get('v3/file/group-index')
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
    api[requestType](`v3/file/${urlType}`, payload)
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
      .delete(`v3/file/group-delete?id=${payload}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
