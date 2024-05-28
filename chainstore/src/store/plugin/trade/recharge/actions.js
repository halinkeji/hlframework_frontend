import { api } from "boot/axios";

export function setData({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "trade/v1/recharge/";
    apiUrl +=
      parseInt(item.id) > 0 ? "update?id=" + parseInt(item.id) : "create";
    var requestType = parseInt(item.id) > 0 ? "put" : "post";
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function checkMoney({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get("trade/v1/recharge/check", { params })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function checkGiveMoney({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get("trade/v1/recharge/checkgive", { params })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
