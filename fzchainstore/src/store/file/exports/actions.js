import { api } from 'boot/axios';

export function getConsumeExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/consume-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getMoneyExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/money-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getPointExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/point-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getReturnExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/return-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getPurchaseExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/purchase-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getInExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/in-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getOrderInExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/orderin-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getOrderGoodsExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/ordergoods-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getAllocationExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/allocation-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getOutExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/out-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getDirectExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/direct-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getChangeExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/change-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getProductExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/product-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getStoreReturnExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/store-return-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getStoreReturnOutExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/store-return-out-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getStoreReturnInExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/store-return-in-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getTransferExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/transfer-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getTransferAllExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/transfer-all-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getConsumeDetailExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/consume-detail-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getNumberExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/number-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getHistoryExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/history-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getArchivesExport({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/file/archives-export`, { params: item })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
