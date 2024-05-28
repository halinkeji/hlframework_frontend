
import { api } from 'src/boot/axios'

export function getSmsMarketManage ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-sms-market-manage', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getBuySmsPackageCode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-buy-sms-package-code', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getBuySmsOrderStatus ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-buy-sms-order-status', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSmsTemplateDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-sms-template-data-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setSmsTemplateDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/sms-market/set-sms-template-data-list', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getTodayMemberBrithday ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-today-member-brithday', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function sendUserBrithday ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/sms-market/send-user-brithday', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSendRecordList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-send-record-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getBuySmsInvoiceList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-buy-sms-invoice-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getSmsLibBuyRecordDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/sms-market/get-sms-lib-buy-record-data-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function sendPhoneCode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v3/sms-market/send-phone-code', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
