import { api } from "boot/axios";

export function setData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post("wechat/v1/card/create", item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get("wechat/v1/card/get-info", {
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

export function deleteCardData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .delete("wechat/v1/card/delete", {
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

export function getWechatCardRecord({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get("wechat/v1/card/card-record", { params: item })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}


export function revokeMemberCard({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get("wechat/v1/card/revoke", { params: item })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}