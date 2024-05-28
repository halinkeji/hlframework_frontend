import { api } from 'boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('formfield/v1/field', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getTemplateList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('formfield/v1/field/template', { params })
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
    let apiUrl = 'formfield/v1/field/'
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

export function setFormData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'formfield/v1/field/'
    apiUrl +=
      parseInt(item.fieldTemplateData.id) > 0 ? 'update-form' : 'create-form'

    const requestType = 'post'

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
      .get('formfield/v1/field/view', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delTemplateData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'formfield/v1/field/del-template'
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

export function delAll ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'formfield/v1/field/alldel'
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

export function delField ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'formfield/v1/field/del-field'
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

export function getFormFieldList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('formfield/v1/field/lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getFormFieldFormList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('formfield/v1/field/form-lists', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getColumnDefs ({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'formfield/v1/field/column-defs'
    api.post(apiUrl + '?id=' + item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
