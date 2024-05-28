import { Cookies, LocalStorage, Notify } from 'quasar'

// auth Config 值

export const authConfig = {
  domain: 'hlfqt2BxF42o44Qqor',
  login_uri: 'hlTaHnvRxxagiYHIYR',
  redirect_uri: 'hlk2If2SOXAUc6OfXa',
  appId: 'hlG9cTQcb7T69C9ot6'
}


/* 判断localStorage token是否过期 */
export const isLocalStorageTokenExpir = () => {
  const expiredTime = parseInt(
    LocalStorage.getItem('myonestore_accessToken_info').expires
  )
  /* 获取本地时间 */
  const nowTime = parseInt(new Date().getTime() / 1000)
  /* 如果小于15分钟，则说明即将过期 */
  return expiredTime - nowTime < 60 * 15
}

/* 判断Cookies token是否过期 */
export const isCookiesTokenExpir = () => {
  const expiredTime = parseInt(Cookies.get('accessToken_info').expires)
  /* 获取本地时间 */
  const nowTime = parseInt(new Date().getTime() / 1000)
  /* 如果小于15分钟，则说明即将过期 */
  return expiredTime - nowTime < 60 * 15
}

// 判断Cookies是否有值
export const isAuthenticated = () => {
  return (
    LocalStorage.getItem('myonestore_loggedIn') &&
    Cookies.get('access_token') ===
      LocalStorage.getItem('myonestore_access_token')
  )
}
export const isCurrentApply = () => {
  const storageAccountInfo = LocalStorage.getItem('myonestore_account_info')
  if (storageAccountInfo && storageAccountInfo.apply_id) {
    if (storageAccountInfo.apply_id != 'myonestore') {
      return false
    }
  }

  const cookieAccountInfo = Cookies.get('account_info')
  if (cookieAccountInfo && storageAccountInfo) {
    if (cookieAccountInfo.user_id && storageAccountInfo.user_id && parseInt(cookieAccountInfo.user_id) != parseInt(storageAccountInfo.user_id)) {
      return false
    }
  }

  return true
}

// 设置 全局LocalStorage
export function setAllLocalStorage () {
  LocalStorage.set('myonestore_access_token', Cookies.get('access_token'))
  LocalStorage.set('myonestore_expires_in', Cookies.get('expires_in'))
  LocalStorage.set('myonestore_refresh_token', Cookies.get('refresh_token'))
  LocalStorage.set('myonestore_token_type', Cookies.get('token_type'))
  LocalStorage.set('myonestore_loggedIn', Cookies.get('loggedIn'))
  LocalStorage.set(
    'myonestore_accessToken_info',
    Cookies.get('accessToken_info')
  )
  LocalStorage.set('myonestore_user_info', Cookies.get('user_info'))
  LocalStorage.set('myonestore_account_info', Cookies.get('account_info'))

  return true
}

// 删除 Cookies
export const removeAllCookies = () => {
  Cookies.remove('access_token', { path: '/', domain: authConfig.domain })
  Cookies.remove('expires_in', { path: '/', domain: authConfig.domain })
  Cookies.remove('refresh_token', { path: '/', domain: authConfig.domain })
  Cookies.remove('token_type', { path: '/', domain: authConfig.domain })
  Cookies.remove('loggedIn', { path: '/', domain: authConfig.domain })
  Cookies.remove('accessToken_info', { path: '/', domain: authConfig.domain })
  Cookies.remove('user_info', { path: '/', domain: authConfig.domain })
  Cookies.remove('account_info', { path: '/', domain: authConfig.domain })
  if (Cookies.get('store_info')) {
    Cookies.remove('store_info', {
      path: '/',
      domain: authConfig.domain
    })
  }
}

// 删除 LocalStorage
export const removeAllLocalStorage = () => {
  LocalStorage.clear()
}

// notify提示
export function notifyError (errorMsg, timeout) {
  Notify.create({
    type: 'negative',
    message: errorMsg,
    timeout,
    position: 'bottom',
    closeBtn: '关闭'
  })
}
