<template>
  <div class="row q-gutter-sm">
     <q-btn unelevated round color="orange" dense icon="las la-file-alt" @click="openRoomLogDialog">
      <q-tooltip>
        日志
      </q-tooltip>
    </q-btn>
    <q-btn unelevated round color="warning" dense icon="las la-door-open" @click="setDeviceData">
      <q-tooltip>
        设备管理
      </q-tooltip>
    </q-btn>
    <q-btn unelevated round color="primary" dense icon="las la-edit" @click="showPopup">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>

    <q-btn unelevated round color="red" dense  icon="las la-trash-alt" @click="delDesk">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>

    <q-btn unelevated round color="orange"  dense icon="las la-link" >
      <q-tooltip>
        小程序入口链接
      </q-tooltip>
    </q-btn>

    <q-btn unelevated round color="positive" dense  icon="las la-qrcode" >
      <q-tooltip>
        下载小程序桌号码
      </q-tooltip>
    </q-btn>

    <q-dialog v-model="qrcodeDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ params.data.qrt_name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-img :src="baseImageUrl" :ratio="1" width="430px" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn unelevated label="下载" color="primary" @click="downloadQrcode" />
          <q-btn unelevated label="关闭" color="grey" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
      dataId: '',
      qrcodeDialog: false,
      baseImageUrl: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    closeDialog () {
      this.qrcodeDialog = false
      this.baseImageUrl = ''
    },
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showAddDesk(this.dataId)
    },
    setDeviceData () {
      this.dataId = this.params.data.id
      this.params.context.setDeviceData(this.dataId)
    },
    openRoomLogDialog () {
      this.dataId = this.params.data.id
      this.params.context.openRoomLogDialog(this.dataId)
    },

    delDesk () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.qrt_name}"的桌号吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('roomManage/deleteRoomData', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除桌号!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
    },
    clickWxappQrcode () {
      const params = {
        path: '/pages/consume-order/index?deskId=' + this.params.data.id
      }
      this.$store.dispatch('desk/getWxappQrcode', params).then((res) => {
        if (res.code == 200) {
          this.qrcodeDialog = true
          this.baseImageUrl = res.data
        } else {
          this.$q.notify({
            message: '失败',
            caption: '生成二维码失败',
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        }
      })
    },
    downloadQrcode () {
      const blob = this.base64ToBlob(this.baseImageUrl) // 转码
      const filename = this.params.data.qrt_name
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = filename
      a.click()
    },
    base64ToBlob (code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new window.Blob([uInt8Array], { type: contentType })
    },
    copyXcxUrl () {
      copyToClipboard('/pages/consume-order/index?deskId=' + this.params.data.id)
        .then(() => {
          this.$q.notify({
            message: '成功',
            caption: '复制成功!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
        .catch(() => {
          // fail
        })
    }
  }
}
</script>
