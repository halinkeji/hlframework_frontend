import { api } from "boot/axios";

export function getListData({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get("trade/v1/contract", { params })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function setData({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "trade/v1/contract/";
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

export function delData({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "trade/v1/contract/alldel";
    api
      .post(apiUrl, item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function getItemData({ commit }, params) {
  return new Promise((resolve, reject) => {
    var apiUrl = "trade/v1/contract/view?id=" + params;
    api
      .get(apiUrl)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
