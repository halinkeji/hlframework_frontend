import { api } from "boot/axios";
import { setAllLocalStorage, notifyError } from "@/utils/common_electron";

//登录
export function login({ commit }, payload) {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append("username", payload.userDetails.username);
    data.append("password", payload.userDetails.password);
    api
      .post(
        `${process.env.ELECTRON_URL}/oauth/authorize/login?response_type=${payload.oauthDetails.response_type}&client_id=${payload.oauthDetails.client_id}&redirect_uri=${payload.oauthDetails.redirect_uri}&scope=${payload.oauthDetails.scope}&state=${payload.oauthDetails.state}`,
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
    api.post(`${process.env.ELECTRON_URL}/oauth/authorize/access-token`, data).then(response => {
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
    api.get(`${process.env.ELECTRON_URL}/oauth/authorize/user-info`).then(response => {
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
        `${process.env.ELECTRON_URL}/oauth/authorize/sign-up?response_type=${payload.oauthDetails.response_type}&client_id=${payload.oauthDetails.client_id}&redirect_uri=${payload.oauthDetails.redirect_uri}&scope=${payload.oauthDetails.scope}&state=${payload.oauthDetails.state}`,
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
      .post(`${process.env.ELECTRON_URL}/oauth/sms/sms/send`, item)
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
        `${process.env.ELECTRON_URL}/oauth/authorize/mobile-login?response_type=${payload.oauthDetails.response_type}&client_id=${payload.oauthDetails.client_id}&redirect_uri=${payload.oauthDetails.redirect_uri}&scope=${payload.oauthDetails.scope}&state=${payload.oauthDetails.state}`,
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
      .post(`${process.env.ELECTRON_URL}/oauth/authorize/check-mobile`, item)
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
      .post(`${process.env.ELECTRON_URL}/oauth/authorize/check-user-name`, item)
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
      .get(`${process.env.ELECTRON_URL}/oauth/authorize/copyright`, {
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
