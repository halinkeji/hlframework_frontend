import { api } from 'src/boot/axios'
import { LocalStorage } from 'quasar'
let siteUrl = ''
if (LocalStorage.getItem('onlystore_system_local')) {
  const systemInfo = LocalStorage.getItem('onlystore_system_local').systemInfo
  if (systemInfo && systemInfo.site_url) {
    siteUrl = systemInfo.site_url
  }
}

export function getGoodsInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get(`${siteUrl}/api/v1/cloud-goods/get-code-data`, { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCloudGoodsLists ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get(`${siteUrl}/api/v1/cloud-goods/get-goods-lists`, { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function addCloudGoosdData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/goods/add-cloud-goosd-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getCloudPicUrl ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get(`${siteUrl}/api/v1/cloud-goods/get-pic-url`, { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 读卡组件请求接口
export function cardReader ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/member/read', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 选择商品组件获取列表
export function getListData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/goods/componentgoods', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 收银台支付函数
export function checkout ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/work/checkout', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 付款码支付统一发起函数
export function scan ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/work/scan', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 付款码支付统一订单验证
export function verify ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/work/verify', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 收银台缓存数据
export function buffer ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/work/buffer', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getListErpData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/goods/goodserp', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 收银台支付函数
export function checkoutPlugin ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/work/checkout-plugin', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 选择商品组件获取列表
export function getGoodsListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/goods/goods-lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getDepotGoods ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/erp-number/depot-goods-number', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
