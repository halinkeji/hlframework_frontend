import { api } from "boot/axios";

export function getListData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get("v3/member", { params: item })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getExData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get("v3/member/lists", { params: item })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getRcData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get("v3/member/listre", { params: item })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getInData({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get("v3/member/listin", { params: item })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getMemberInfo({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/member/view?id=` + itemId)
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
    var apiUrl = "v3/member/";
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
    var apiUrl = "v3/member/alldel";

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

export function allupdate({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "v3/member/allput";
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

export function delList({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "v3/member/delete?id=";
    apiUrl += item;

    api
      .delete(apiUrl)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//曲小敏 新增

//批量添加会员 start
export function addMembers({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "v3/member/add-some";
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
//批量添加会员 end

//批量修改储值   start
export function allchange({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "v3/member/all-change";
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
//批量添加会员 end
export function uploadMember({ commit }, item) {
  return new Promise((resolve, reject) => {
    var apiUrl = "v3/member/uploadmember";
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
