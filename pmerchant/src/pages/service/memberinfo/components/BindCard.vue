<template>
    <q-dialog v-model="changeDialogStatus">
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-form ref="memberDataRef">
          <q-toolbar>
            <q-toolbar-title> 写入实体卡</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup @click="closeButton" />
          </q-toolbar>
          <q-card-section>
            <div class="row">
              <div class="col-md-6 col">
                <q-input v-model="memberInformation.mem_memberCardNum" dense outlined bottom-slots lazy-rules :rules="[(val) => !!val || '卡号是必填的', (val) => /^\d+$/.test(val) || '卡号为数字']">
                  <template v-slot:prepend>
                    <span class="text-subtitle1">会员卡号 *</span>
                  </template>
                </q-input>
              </div>
              <div class="col-md-auto">
                <q-btn unelevated v-if="rfid1 == '1'" color="green-6" label="写入制卡" size="15px" class="q-ml-md" @click="writeCard" />
                <q-btn unelevated color="red-6" label="生成新卡号" size="15px" class="q-ml-sm" @click="math" />
              </div>
            </div>
            <div class="row">
              <q-space />
              <q-btn  unelevated color="grey-7" label="关闭" v-close-popup @click="closeButton" />
              <q-btn unelevated @click="saveBut" color="blue-6" v-if="writeStatus" label="保存" class="q-ml-sm" />
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
  name: 'BindCard',
  data () {
    return {
      dialogWidth: '1000px',
      memberInformation: {
        mem_memberCardNum: ''
      },
      changeDialogStatus: false,
      rfid1: '',
      rfid2: '',
      readJsUrl: 'http://127.0.0.1:8008/YOWOCloudRFIDReader.js',
      writeStatus: false
    }
  },
  mounted () {

  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  computed: {},
  methods: {
    math () {
      this.memberInformation.mem_memberCardNum = Date.parse(new Date()) / 100
    },
    init (val) {
      this.changeDialogStatus = true
      this.getRfidReaderStatus()
      if (val > 0) {
        this.memberInformation.id = val
      }
    },
    // 关闭
    closeButton () {
      this.memberInformation.id = ''
      this.memberInformation.mem_memberCardNum = ''
      this.changeDialogStatus = false
    },
    saveBut () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          this.memberInformation.mem_memberCardNum = this.memberInformation.mem_memberCardNum + ''
          const obj = {
            ...this.memberInformation
          }
          this.$store
            .dispatch('member/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '会员卡号更新成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.changeDialogStatus = false
                this.$emit('returnMethod', this.memberInformation.mem_memberCardNum)
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },

    // 读卡器开关
    getRfidReaderStatus () {
      const that = this
      this.$store
        .dispatch('rfidPlugin/getSetSwitch')
        .then((res) => {
          if (res.code == 200) {
            const rfidDataForm = res.data

            this.rfid1 = rfidDataForm.rfid_rfid_rfid1
            this.rfid2 = rfidDataForm.rfid_rfid_rfid2
            this.rfid3 = rfidDataForm.rfid_rfid_rfid3

            if (this.rfid1 == 1) {
              if (!this.isInclude(this.readJsUrl)) {
                this.initReadJsUrl()
              }
              try {
                const rfidreader = YOWORFIDReader.createNew()
                if (!rfidreader.TryConnect()) {
                  this.$q
                    .dialog({
                      title: '提示',
                      message: '浏览器不支持，请更换浏览器后重试' + 'RFID硬件读写器',
                      cancel: true,
                      persistent: true
                    })
                    .onOk(() => {})
                    .onCancel(() => {})
                    .onDismiss(() => {})
                }
              } catch (e) {
                this.$q
                  .dialog({
                    title: '提示',
                    message: `创建RFID云服务连接失败，请先下载安装！(彻底关闭提示请关闭RFID硬件读写器开关)",
                  "提示`,
                    cancel: false,
                    persistent: true,
                    confirmButtonText: '下载安装',
                    cancelButtonText: '关闭'
                  })
                  .onOk(() => {
                    window.location.href = 'http://www.youwokeji.com.cn/CloudReader/YOWORFIDReaderCloudForWeb.exe'
                  })
                  .onCancel(() => {})
                  .onDismiss(() => {})
              }
            } else {
              this.$q
                .dialog({
                  title: '提示',
                  message: '未开启读卡器',
                  cancel: false,
                  persistent: true
                })
                .onOk(() => {
                  that.closeButton()
                })
                .onCancel(() => {})
                .onDismiss(() => {})
            }
          }
        })
        .catch((error) => {})
    },
    // 写入制卡
    writeCard () {
      const rfidreader = YOWORFIDReader.createNew()

      if (!rfidreader.TryConnect()) {
        this.$alert('浏览器不支持，请更换浏览器后重试！', 'RFID硬件读写器', {
          confirmButtonText: '确定',
          callback: (action) => {}
        })
      }
      const SectorID = this.rfid2
      const Data = this.memberInformation.mem_memberCardNum
      const that = this
      rfidreader.KeyMode = 0
      rfidreader.KeyStringMode = 0
      rfidreader.KeyString = 'FFFFFFFFFFFF'
      rfidreader.Repeat = 0
      rfidreader.M1WriteSector(SectorID, Data, 1)
      rfidreader.onResult(function (resultdata) {
        switch (resultdata.FunctionID) {
          case 8:
            if (resultdata.Result > 0) {
              that.$q.notify({
                message: '成功',
                caption: '写入制卡成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              that.writeStatus = true
            } else {
              that.$q.notify({
                message: '失败',
                caption: '写入失败!错误：' + rfidreader.GetErrStr(resultdata.Result),
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            }
            break
        }
      })
    },
    initReadJsUrl () {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = this.readJsUrl
      document.body.appendChild(s)
    }
  }
}
</script>
