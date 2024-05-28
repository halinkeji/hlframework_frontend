// 初始化websocket,连接、心跳等
export function initWebSorket ({ commit }, payload) {
  commit('ONOPEN')
}

// 给服务端发送数据
export function sendMessage ({ commit }, payload) {
  commit('SEND', payload)
}

// 获取服务端传过来的数据
export function getMessage ({ commit }, payload) {
  commit('MESSAGE', payload)
}

// 手动关闭
export function close ({ commit }, payload) {
  commit('CLOSE', payload)
}

// 手动连接
export function connect ({ commit }, payload) {
  commit('CONNECT', payload)
}
