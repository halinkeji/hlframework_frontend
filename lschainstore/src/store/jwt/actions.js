import { api } from 'boot/axios'
import { loadFileAuth, setAllLocalStorage, notifyError } from '@/utils/common_electron'
import { LocalStorage, Notify } from 'quasar'

// 网络设置
let api_url = ''
let localJsonData = LocalStorage.getItem('lschainstore_auth_json')
if(localJsonData){
  api_url = localJsonData.apiEletronUrl
}else if (loadFileAuth()) {
  let fileJsonData = loadFileAuth()
  api_url  = fileJsonData.apiEletronUrl
}
let apiAuthUrl = api_url ? api_url : ''

//登录
export function login({ commit }, payload) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append("username", payload.userDetails.username);
    data.append("password", payload.userDetails.password);
    api
      .post(
        `${apiAuthUrl}/oauth/authorize/login?response_type=${payload.oauthDetails.response_type}&client_id=${payload.oauthDetails.client_id}&redirect_uri=${payload.oauthDetails.redirect_uri}&scope=${payload.oauthDetails.scope}&state=${payload.oauthDetails.state}`,
        data
      )
      .then(response => {
        if (response.code === 200 && response.data.code) {
          resolve(getAccessToken(response.data))
        } else {
          notifyError("登录失败，请稍后重试！", 3 * 1000)
          resolve(999)
        }
        
      })
      .catch(error => {
        reject(error);
      });
  });
}

function getAccessToken(codeData) {
  let data = new FormData();
  data.append("grant_type", "authorization_code");
  data.append("client_id", codeData.client_id);
  data.append("client_secret", codeData.client_secret);
  data.append("code", codeData.code);
  data.append("redirect_uri", codeData.redirect_uri);
  data.append("state", codeData.state);
  return new Promise((resolve, reject) => {
    api.post(`${apiAuthUrl}/oauth/authorize/access-token`, data).then(response => {
      if (response.code === 200 && response.data.access_token) {
        if (setAllLocalStorage(response.data)) {
          resolve(getUserInfo())
        }
      } else {
        notifyError("登录失败，请稍后重试！", 3 * 1000)
        resolve(999)
      }
    })
  })
}

function getUserInfo(Cookies_Data) {
  return new Promise((resolve, reject) => {
    api.get(`${apiAuthUrl}/oauth/authorize/user-info`).then(response => {
      if (
        response.code === 200 &&
        response.data.accessToken_info &&
        response.data.user_info
      ) {
        if (setAllLocalStorage(response.data)) {
          resolve(1)
        }
      } else {
        notifyError("登录失败，请稍后重试！", 3 * 1000)
        resolve(999)
      }
    })
  })
}

//注册
export function signup({ commit }, payload) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append("username", payload.signData.username);
    data.append("password", payload.signData.password);
    data.append("mobile", payload.signData.mobile);
    api
      .post(
        `${apiAuthUrl}/oauth/authorize/sign-up?response_type=${payload.oauthDetails.response_type}&client_id=${payload.oauthDetails.client_id}&redirect_uri=${payload.oauthDetails.redirect_uri}&scope=${payload.oauthDetails.scope}&state=${payload.oauthDetails.state}`,
        data
      )
      .then(response => {
        if (response.code === 200 && response.data.code) {
          resolve(getAccessToken(response.data))
        } else {
          notifyError("登录失败，请稍后重试！", 3 * 1000)
          resolve(999)
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 发送短信
export function sendSms({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post(`${apiAuthUrl}/oauth/sms/sms/send`, item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
// 手机号登录
export function phoneNumberLogin({ commit }, payload) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append("phoneNumber", payload.phoneNumber);
    api
      .post(
        `${apiAuthUrl}/oauth/authorize/mobile-login?response_type=${payload.oauthDetails.response_type}&client_id=${payload.oauthDetails.client_id}&redirect_uri=${payload.oauthDetails.redirect_uri}&scope=${payload.oauthDetails.scope}&state=${payload.oauthDetails.state}`,
        data
      )
      .then(response => {
        if (response.code === 200 && response.data.code) {
          resolve(getAccessToken(response.data))
        } else {
          notifyError("登录失败，请稍后重试！", 3 * 1000)
          resolve(999)
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
// 手机号验证
export function checkMobile({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post(`${apiAuthUrl}/oauth/authorize/check-mobile`, item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 用户名验证
export function checkUserName({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post(`${apiAuthUrl}/oauth/authorize/check-user-name`, item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// OEM信息
export function getCopyright({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`${apiAuthUrl}/oauth/authorize/copyright`, {
        params: item
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 云端版本号
export function getCloudUrl ({ commit }) {
  let url = 'https://api.halin.net/oauth/v3/soft-update'
  return new Promise((resolve, reject) => {
    api
      .get(url, {
        params: {
          'apply_id': 'lschainstore'
        }
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 云端版本号
export function cloudVersion ({ commit }, item) {
     
  return new Promise((resolve, reject) => {
    api
      .get(item.url)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}