import { LocalStorage } from 'quasar'

export function SEND (state, payload) {
  const message = payload
  console.log('已向服务器发送数据', payload)
  state.ws.send(JSON.stringify(message))
}

// 手动关闭连接
export function CLOSE (state, payload) {
  console.log('手动关闭连接', payload)
  state.lockReconnect = true
  state.linkCount = 4
  state.ws.close()
}
// 手动连接socket
export function CONNECT (state, payload) {
  console.log('手动连接', payload)
  state.lockReconnect = false
  state.linkCount = 0
  RECONNECT(state)
}

export function ONOPEN (state, payload) {
  const systemLocal = LocalStorage.getItem('hlelectron_system_local')
  const accessToken = LocalStorage.getItem('hlelectron_access_token')
  if (systemLocal && systemLocal.websocketClient && accessToken && accessToken.access_token) {
    // state.ws = new WebSocket(systemLocal.websocketClient)
    state.ws = new WebSocket("wss://www.halin.cc:7272")

    state.ws.onopen = function (res) {
      console.log('连接成功')
      const message = {
        type: 'login',
        data: {
          'Electron-Token' : accessToken.access_token
        }
      }
      state.ws.send(JSON.stringify(message))
      state.lockHeart = true
      HEARTBEAT(state)
    }

    MESSAGE(state)

    ONCOLOSE(state)

    ONERROR(state)

    // 监听连接事件
    // state.ws.addEventListener('open', function(event) {
    //   // state.ws.close(200,'Token验证失败')
    //   console.log("Connected to server", event);
    // })

    // 监听消息事件
    // state.ws.addEventListener('message', function(event) {
    //   console.log('Message from server ', event);
    // })
  }
}

export function MESSAGE (state, payload) {
  state.ws.onmessage = function (res) {
    const msg = JSON.parse(res.data)
    state.msg = msg
    return msg
  }
}

export function ONERROR (state, payload) {
  state.ws.onerror = function () {
    console.log('连接失败')
    RECONNECT(state)
  }
}

export function ONCOLOSE (state, payload) {
  state.ws.onclose = function () {
    console.log('连接关闭')
    state.lockHeart = false
    RECONNECT(state)
  }
}

export function RECONNECT (state) {

  if (state.lockReconnect) {
    return
  }

  if (state.linkCount >= 3) {
    return
  }

  state.linkCount = state.linkCount + 1
  state.lockReconnect = true
  // 没连接上会一直重连，设置延迟避免请求过多
  state.tt && clearTimeout(state.tt)
  state.tt = setTimeout(function () {
    ONOPEN(state)
    state.lockReconnect = false
  }, 2000)
}

export function HEARTBEAT (state) {
  state.timeoutObj && clearTimeout(state.timeoutObj)
  state.serverTimeoutObj && clearTimeout(state.serverTimeoutObj)
  if(state.lockHeart){
    setTimeout(function () {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      const message = {
        type: 'pong'
      }
      state.ws.send(JSON.stringify(message))
      HEARTBEAT(state)
    }, state.timeout)
  }
}
