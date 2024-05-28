import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'
let siteUrl = ''
if (LocalStorage.getItem('onlystore_system_local')) {
  const systemInfo = LocalStorage.getItem('onlystore_system_local').systemInfo
  if (systemInfo && systemInfo.site_url) {
    siteUrl = systemInfo.site_url
  }
}

export function getList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('wxapp/v1/set', { params })
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
    let apiUrl = 'wxapp/v1/set/'
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
export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxapp/v1/set/delete?id=' + parseInt(item.id)

    api
      .delete(apiUrl, item)
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
    const apiUrl = 'wxapp/v1/set'
    api.get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getTemplateData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxapp/v1/template'
    api.get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setTemplateData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxapp/v1/template/create'
    api.post(apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCompanyData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxapp/v1/set/get-company-data'
    api.get(apiUrl)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setCompanyData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'wxapp/v1/set/set-company'
    api.post(apiUrl, params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getNewVersion ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post(`${siteUrl}/api/v1/cloud-wechat-tool/get-release`, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLoginQr ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post(`${siteUrl}/api/v1/cloud-wechat-tool/get-login-qr`, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getIsLoginStatus ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post(`${siteUrl}/api/v1/cloud-wechat-tool/is-login`, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setUploadCode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post(`${siteUrl}/api/v1/cloud-wechat-tool/upload-code`, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
