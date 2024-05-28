import { api } from "boot/axios";

export function getListData({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get("trade/v1/info", { params })
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
    var apiUrl = "trade/v1/trade-contract/view?id=" + params;
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
export function getListTotal({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get("trade/v1/info/total", { params })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

