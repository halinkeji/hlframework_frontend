import { api } from 'src/boot/axios';

export function getData({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cloudprinter/v1/setting', { params })
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
      .get('cloudprinter/v1/setting/view?id=' + itemId)
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
    let apiUrl = 'cloudprinter/v1/setting/';
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
    let apiUrl = 'cloudprinter/v1/setting/delete?id=';
    apiUrl += item;
    api
      .delete(apiUrl, item)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getDataList({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cloudprinter/v1/setting/lists', { params })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function saveTemplate({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('cloudprinter/v1/setting/save-template', params)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getTemplate({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cloudprinter/v1/setting/get-template', { params })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function sendTest({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cloudprinter/v1/setting/send-test', { params })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function printErp({ commit }, item) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'cloudprinter/v1/setting/print-erp';

    api
      .delete(apiUrl, item)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function saveErpTemplate({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('cloudprinter/v1/setting/save-erp-template', params)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getErpTemplate({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cloudprinter/v1/setting/erp-template', { params })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getLableItem({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cloudprinter/v1/lable', { params })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function setLableData({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'cloudprinter/v1/lable/';
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
export function getLableTemple({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('cloudprinter/v1/lable/temple')
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


