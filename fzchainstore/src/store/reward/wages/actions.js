import { api } from 'boot/axios';

export function getData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/wages', { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getItem({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/wages/view?id=' + itemId)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function setData({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/reward/wages/';
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create';
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post';
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function delData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/reward/wages/deleteall', item)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getRecordData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/wages/record', { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getUserData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/wages/user', { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getSubsidyList({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/reward/wages/subsidy-list', { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

