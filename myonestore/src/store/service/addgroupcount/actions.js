import { api } from "boot/axios";

export function getCountPackageList({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/add-group-count/lists', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  });
}

export function getListData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v3/add-group-count', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  });
}

export function addShoppingCart({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = 'v3/add-group-count/'

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

export function delList({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = 'v3/add-group-count/alldel'

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

export function putnumber({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/add-group-count/putnumber', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  });
}

export function addinvoice({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v3/add-group-count/addinvoice', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  });
}
