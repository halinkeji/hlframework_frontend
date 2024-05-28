import { api } from "boot/axios";

export function getListData({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get("trade/v1/debt", { params })
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
    var apiUrl = "trade/v1/debt/";
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
export function getItemData({ commit }, params) {
  return new Promise((resolve, reject) => {
    var apiUrl = "trade/v1/debt/view?id=" + params;
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
