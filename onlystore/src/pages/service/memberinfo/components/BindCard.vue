<template>
  <q-dialog v-model="changeDialogStatus">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <q-form ref="memberDataRef">
        <q-toolbar>
          <q-toolbar-title> 写入实体卡</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="closeButton" />
        </q-toolbar>
        <q-card-section>
          <q-input
            v-model="memberInformation.mem_memberCardNum"
            dense
            outlined
            bottom-slots
            lazy-rules
            readonly
            :rules="[(val) => !!val || '卡号是必填的']"
          >
            <template v-slot:prepend>
              <span class="text-subtitle1">会员卡号 *</span>
            </template>
            <template v-slot:after>
              <q-btn unelevated v-if="rfid1 == '1'" color="green-6" label="写入制卡" size="15px" class="q-ml-md" @click="writeCard" />
              <q-btn unelevated color="red-6" v-if="!(storeMemberConfig && parseInt(storeMemberConfig.member_level_defaultMobile) == 1)" label="生成新卡号" size="15px" class="q-ml-sm" @click="generateNewCardNumber" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions class="row justify-center q-gutter-sm">
          <q-btn unelevated color="grey-7" label="关闭" class="q-px-xl" v-close-popup @click="closeButton" />
          <q-btn unelevated @click="saveBut" color="blue-6" v-if="writeStatus" label="保存" class="q-px-xl" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'BindCard',
  data () {
    return {

      memberInformation: {
        mem_memberCardNum: ''
      },
      changeDialogStatus: false,
      rfid1: '',
      rfid2: '',
      readJsUrl: 'http://127.0.0.1:8008/YOWOCloudRFIDReader.js',
      writeStatus: false,
      storeMemberConfig: {}
    }
  },
  mounted () {},
  created () {

  },
  computed: {},
  methods: {

    generateNewCardNumber () {
      let cardNumber = ''
      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberPrefix) {
        cardNumber += this.storeMemberConfig.member_level_cardNumberPrefix
      }

      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberLength) {
        cardNumber += this.randomStr(this.storeMemberConfig.member_level_cardNumberLength)
      } else {
        cardNumber += this.randomStr(11)
      }

      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberSuffix) {
        cardNumber += this.storeMemberConfig.member_level_cardNumberSuffix
      }
      this.memberInformation.mem_memberCardNum = cardNumber
    },

    randomStr (cardNumberLength) {
      const len = parseInt(cardNumberLength) ? parseInt(cardNumberLength) : 11
      const t = '1234567890'
      let val = ''
      for (let i = 0; i < len; i++) {
        val += t.charAt(Math.floor(Math.random() * t.length))
      }
      return val
    },
    init (val) {
      this.changeDialogStatus = true
      this.getRfidReaderStatus()
      if (this.$q.localStorage.getItem('onlystore_store_local').storeMemberConfig) {
        this.storeMemberConfig = this.$q.localStorage.getItem('onlystore_store_local').storeMemberConfig
      }
      if (val && val.id) {
        this.memberInformation.id = val.id
        if (this.storeMemberConfig && parseInt(this.storeMemberConfig.member_level_defaultMobile) == 1) {
          this.memberInformation.mem_memberCardNum = val.mem_memberMobile
        }
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
