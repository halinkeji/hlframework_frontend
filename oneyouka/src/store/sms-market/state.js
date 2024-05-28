export default function () {
  return {
    ws: null,
    tt: null, // 重连时的定时器
    linkCount: 0, // 重连几次失败停止连接
    msg: null, // socket推送回来的消息
    lockReconnect: false, // 是否真正建立连接
    timeout: 10000, // 4秒一次心跳
    timeoutObj: null, // 心跳倒计时
    serverTimeoutObj: null, // 心跳倒计时
    lockHeart: true,
  }
}
