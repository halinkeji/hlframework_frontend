import { api } from "boot/axios";

export function getItem({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get("wechat/v1/set")
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
    var apiUrl = "wechat/v1/set/";
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
export function newkey({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post("wechat/v1/set/newkey", item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
