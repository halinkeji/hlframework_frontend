<template>
  <div>
    <q-dialog v-model="dialogStatus">
      <q-card
        class="bg-grey-3"
        :style="{
          width: parseInt(this.$q.screen.width * (adaptationWidth.indexOf($q.screen.name) > -1 ? 0.8 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (adaptationWidth.indexOf($q.screen.name) > -1 ? 0.8 : 0.4)) + 'px',
        }"
      >
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="column full-height">
                <div class="col flex flex-center bg-cyan">
                  <q-icon name="las la-qrcode" size="xl" color="white"></q-icon>
                </div>
                <div class="col  flex flex-center bg-blue-grey text-white">
                  <div class="row text-center">
                    <div class="col-12" @click="rfidReadingMemberData">
                      <q-icon name="credit_card" size="xl" color="white"></q-icon>
                    </div>
                    <div class="col-12">
                      实体卡(IC、M1等)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col q-pa-sm">
              <q-input
                outlined
                @keyup.enter.native="cardReader"
                v-model="card_number"
                ref="readCardInput"
                :dense="dense"
                label="请输入卡号/身份证/电话号"
                class="q-pa-sm"
              >
                <template v-slot:after>
                  <q-btn unelevated color="blue-6" label="读卡(D)" @click="cardReader()" class="q-px-md full-height" />
                </template>
              </q-input>
              <hl-keyboard
                @changeNumber="
                  (v) => {
                    card_number = v
                  }
                "
                :inputNumber="card_number"
                @confirmEvent="cardReader"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: ['scenes', 'dense'],
  data () {
    return {
      dialogStatus: false,
      userData: {},
      card_number: '',
      rfid1: '1',
      rfid2: '1',
      rfid3: '1',
      readJsUrl: 'http://127.0.0.1:8008/YOWOCloudRFIDReader.js',
      adaptationWidth: ['xs', 'sm', 'md']
    }
  },
  created: function () {},
  mounted () {
    this.openPlugins = this.$q.localStorage.getItem('mychainstore_store_local').openPlugins
    if (this.openPlugins && this.openPlugins.indexOf('Rfid') > -1) {
      setTimeout(() => {
        this.rfidReadingMember()
      }, 1000)
    }
    const that = this
    document.onkeydown = function (event) {
      const key = window.event.keyCode

      if (key === 68) {
        // 监听ctrl+A组合键
        // window.event.preventDefault(); //关闭浏览器默认快捷键  && event.ctrlKey
        that.rfidReadingMemberData()
      }
      // else if (key === 83 && event.ctrlKey) {
      //   window.event.preventDefault(); //关闭浏览器快捷键
      //   console.log("保存");
      // }
    }
  },

  methods: {
    openReaderDialog () {
      this.dialogStatus = true
      const that = this
      setTimeout(() => {
        that.focusInput()
      }, 500)
    },

    // 读卡传值
    cardReader () {
      if (this.card_number) {
        const obj = {
          card_number: this.card_number,
          scenes: this.scenes
        }

        this.$store
          .dispatch('components/cardReader', obj)
          .then((res) => {
            if (res.code == 200) {
              this.userData = res.data

              this.$q.notify({
                message: '成功',
                caption: res.message,
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.card_number = ''
              this.dialogStatus = false
              this.$emit('refreshDataList', this.userData)
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top'
              })
              this.userData = {}
              this.card_number = ''
              this.focusInput()
            }
          })
          .catch((error) => {
            // console.log("12131", error);
          })
      }
    },

    // 会员清空
    emptyMemberCardInfo () {
      // this.$refs.card_number.focus();
      this.card_number = ''

      this.focusInput()

      this.userData = {
        mem_memberCardNum: '',
        mem_memberName: '',
        memberCardPointsCount: '',
        memberCardMoneyCount: '',
        memberCardLevelName: '',
        mem_specifiedEndTime: ''
      }
    },

    // 读卡器
    rfidReadingMember () {
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

              setTimeout(() => {
                try {
                  const rfidreader = YOWORFIDReader.createNew()
                  if (!rfidreader.TryConnect()) {
                    that.$q
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
                  that.$q
                    .dialog({
                      title: '提示',
                      message: `创建RFID云服务连接失败，请先下载安装！(彻底关闭提示请关闭RFID硬件读写器开关)",
                  "提示`,
                      cancel: true,
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
              }, 1500)
            }
          }
        })
        .catch((error) => {})
    },

    // 读卡器读卡
    rfidReadingMemberData () {
      this.focusInput()
      if (this.rfid1 == 1) {
        const rfidreader = YOWORFIDReader.createNew()
        rfidreader.TryConnect()
        const rfid3statedata = this.rfid3
        const KeyFF = 'FFFFFFFFFFFF'
        if (parseInt(rfid3statedata) == 1) {
          var SectorID = parseInt(this.rfid2)
        }
        const that = this
        rfidreader.KeyMode = 0
        rfidreader.KeyStringMode = 0
        rfidreader.KeyString = KeyFF
        rfidreader.Repeat = 0
        rfidreader.M1ReadSector(SectorID, 1)
        rfidreader.onResult(function (resultdata) {
          switch (resultdata.FunctionID) {
            case 7:
              if (resultdata.Result > 0) {
                that.card_number = resultdata.strData
              } else {
                that.card_number = resultdata.strData
              }
              break
          }
        })

        setTimeout(() => {
          console.log('resultdata', this.card_number)

          // this.card_number = document.getElementById("card_number").value;

          if (this.card_number != '') {
            that.cardReader()
          } else {
            this.$q.notify({
              message: '读卡失败',
              color: 'red',
              position: 'top'
            })
          }
        }, 1000)
      }
    },

    // 给定指定ID 获取会员信息
    getMemberIdReturnData (memberId) {
      if (memberId > 0) {
        const obj = {
          id: memberId,
          scenes: this.scenes
        }
        this.$store
          .dispatch('components/cardReader', obj)
          .then((res) => {
            if (res.code == 200) {
              this.userData = res.data

              this.$q.notify({
                message: '成功',
                caption: res.message,
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.card_number = ''

              this.$emit('refreshDataList', this.userData)
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top'
              })
              this.userData = {}
              this.card_number = ''
              this.focusInput()
            }
          })
          .catch((error) => {
            // console.log("12131", error);
          })
      }
    },

    focusInput () {
      if (this.$refs.readCardInput) {
        this.$refs.readCardInput.focus()
      }
    },

    isInclude (name) {
      const js = /js$/i.test(name)
      const es = document.getElementsByTagName(js ? 'script' : 'link')
      for (let i = 0; i < es.length; i++) {
        if (es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true
      }
      return false
    },

    initReadJsUrl () {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = this.readJsUrl
      document.body.appendChild(s)
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
