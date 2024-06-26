import { api } from 'boot/axios'

// 保存角色信息
export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/role/create', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 更新角色信息
export function updateRoleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .put(`v3/role/update?id=${item.id}`, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 保存用户角色信息
export function setUesrRoleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/role/set-user', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取菜单树状列表
export function getRoleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/role', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取角色详情
export function getRoleOneData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/role/one', {
        params: item
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 删除菜单
export function delOneData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .delete(`v3/role/delete?id=${item.id}`)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 获取当前用户可用权限
export function getApplyRoleList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/role/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取当前用户可用权限
export function getUserRelationList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/role/relation', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 获取角色详情
export function getUserRoleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/role/user-role', {
      params
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
