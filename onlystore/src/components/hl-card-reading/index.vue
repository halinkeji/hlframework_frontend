<template>
  <div>
    <q-card flat class="rounded-borders" v-if="navType == 'horizontal'">
      <div class="row items-center " v-if="$q.screen.gt.md">
        <div class="col-12 col-md-4 q-pa-md">
          <q-input outlined @keyup.enter.native="cardReader" v-model="card_number" ref="readCardInput" :dense="dense" class="full-width" label="请输入卡号/身份证/手机号">
            <template v-slot:after>
              <q-btn unelevated color="blue-6" label="读卡(D)" @click="cardReader()" class="q-px-md full-height" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-7" v-if="userData.id">
          <div class="row q-pa-xs q-mt-sm">
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8">卡号：{{ userData.mem_memberCardNum }}</q-chip>
            </div>
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8">昵称：{{ userData.mem_memberName }}</q-chip>
            </div>
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8"> 级别：{{ userData.memberLevel ? userData.memberLevel.mcl_level_name : '无等级' }} </q-chip>
            </div>
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8">
                有效期：
                <span v-if="parseInt(userData.mem_specifiedEndTime) < 2147457847">
                  {{ this.$q_date.formatDate(userData.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }}
                </span>
                <span v-else>
                  永久有效
                </span>
              </q-chip>
            </div>
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8">真实姓名：{{ userData.mem_memberRealName }}</q-chip>
            </div>
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8">
                总{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}：{{ userData.mem_memberPointsCount > 0 ? userData.mem_memberPointsCount : '0' }}
              </q-chip>
            </div>
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8">
                总{{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit }}：{{ userData.mem_memberMoneyCount > 0 ? userData.mem_memberMoneyCount : '0' }}
              </q-chip>
            </div>
            <div class="col-6 col-md-3">
              <q-chip square color="blue-1" text-color="blue-8"> 总次数：{{ userData.mem_memberNumberCount > 0 ? userData.mem_memberNumberCount : '0' }} </q-chip>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <q-card flat bordered class="q-mt-xs" v-if="userData.id">
          <q-item>
            <q-item-section avatar>
              <q-avatar v-if="userData.coverImage && userData.coverImage.id" text-color="white">
                <img :src="$q.localStorage.getItem('onlystore_system_local').attach_url + userData.coverImage.path" />
              </q-avatar>
              <q-avatar color="grey" text-color="white" v-else icon="person" />
            </q-item-section>

            <q-item-section side>
              <q-item-label class="text-dark">
                {{ userData.mem_memberName }}
                <span class="q-mr-sm">({{ userData.mem_memberRealName }})</span>
              </q-item-label>
              <q-item-label caption>卡号：{{ userData.mem_memberCardNum }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption lines="1">会员级别</q-item-label>
              <q-item-label class="text-subtitle2">{{ userData.memberLevel ? userData.memberLevel.mcl_level_name : '无等级' }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption lines="1">到期时间</q-item-label>
              <q-item-label class="text-subtitle2">
                <span v-if="parseInt(userData.mem_specifiedEndTime) < 2147457847">
                  {{ this.$q_date.formatDate(userData.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }}
                </span>
                <span v-else>
                  永久有效
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset />
          <div class="row q-col-gutter-sm items-center text-caption text-blue-9">
            <div class="col text-center">
              <div class="q-py-sm">
                <div class="text-h6 text-bold">
                  {{ formatAmount(userData.mem_memberMoneyCount) }}
                </div>
                {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit }}
              </div>
            </div>
            <div class="col text-center">
              <div class="q-py-sm">
                <div class="text-h6 text-bold">
                  {{ formatAmount(userData.mem_memberPointsCount) }}
                </div>
                {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}
              </div>
            </div>
            <div class="col text-center">
              <div class="q-py-sm">
                <div class="text-h6 text-bold">
                  {{ formatAmount(userData.mem_memberNumberCount) }}
                </div>
                次数
              </div>
            </div>
          </div>
        </q-card>
        <div v-else>
          <q-card flat bordered>
            <div class="row items-center">
              <div class="col-6 q-pl-md">
                <q-icon name="las la-id-card-alt" color="grey-3" size="xl"> </q-icon>
              </div>
              <div class="col-6 text-right q-pr-md">
                <q-btn unelevated color="primary" @click="openCardReader" class="q-px-md" label="读卡" />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card>

    <div flat class="full-width" square v-if="navType == 'vertical'">
      <q-card flat>
        <q-input outlined @keyup.enter.native="cardReader" v-model="card_number" ref="readCardInput" :dense="dense" class="full-width" label="请输入卡号/身份证/电话号">
          <template v-slot:after>
            <q-btn unelevated color="blue-6" label="读卡(D)" @click="cardReader()" class="q-px-md full-height" />
          </template>
        </q-input>
      </q-card>
      <q-card flat bordered class="q-mt-xs" v-if="userData.id">
        <q-item>
          <q-item-section avatar>
              <q-avatar v-if="userData.coverImage && userData.coverImage.id" text-color="white">
                <img :src="$q.localStorage.getItem('onlystore_system_local').attach_url + userData.coverImage.path" />
              </q-avatar>
              <q-avatar color="grey" text-color="white" v-else icon="person" />
          </q-item-section>

          <q-item-section side>
            <q-item-label class="text-dark">
              {{ userData.mem_memberName }}
              <span class="q-mr-sm">({{ userData.mem_memberRealName }})</span>
            </q-item-label>
            <q-item-label caption>卡号：{{ userData.mem_memberCardNum }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption lines="1">会员级别</q-item-label>
            <q-item-label class="text-subtitle2">{{ userData.memberLevel ? userData.memberLevel.mcl_level_name : '无等级' }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption lines="1">到期时间</q-item-label>
            <q-item-label class="text-subtitle2">
              <span v-if="parseInt(userData.mem_specifiedEndTime) < 2147457847">
                {{ this.$q_date.formatDate(userData.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }}
              </span>
              <span v-else>
                永久有效
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset />
        <div class="row q-col-gutter-sm items-center text-caption text-blue-9">
          <div class="col text-center">
            <div class="q-py-sm">
              <div class="text-h6 text-bold">
                {{ formatAmount(userData.mem_memberMoneyCount) }}
              </div>
              {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_balanceUnit }}
            </div>
          </div>
          <div class="col text-center">
            <div class="q-py-sm">
              <div class="text-h6 text-bold">
                {{ formatAmount(userData.mem_memberPointsCount) }}
              </div>
              {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_integralUnit }}
            </div>
          </div>
          <div class="col text-center">
            <div class="q-py-sm">
              <div class="text-h6 text-bold">
                {{ formatAmount(userData.mem_memberNumberCount) }}
              </div>
              次数
            </div>
          </div>
        </div>
      </q-card>

      <q-card-section v-else class="flex flex-center">
        <q-icon name="las la-id-card-alt" color="grey-3" size="130px"> </q-icon>
      </q-card-section>
    </div>

    <q-dialog v-model="cardReaderStatus" persistent>
      <q-card
        class="bg-grey-3  readerRadius"
        :style="{
          height: $q.screen.height * 0.7 + 'px',
        }"
      >
        <q-toolbar class="text-primary">
          <q-btn flat round dense icon="credit_card" class="q-mr-sm" />

          <q-toolbar-title>会员读卡</q-toolbar-title>

          <q-btn flat round @click="cardReaderStatus = false" dense icon="cancel" />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md q-gutter-xs">
          <q-input outlined v-model="card_number" @keyup.enter.native="cardReader" ref="readCardInput" label="请输入卡号/身份证/电话号" class="full-width text-h6"> </q-input>
        </div>
        <div class="absolute-bottom q-pa-sm ">
          <hl-keyboard
            :keyboardStatus="true"
            :inputNumber="card_number"
            @changeNumber="
              (v) => {
                card_number = v
              }
            "
            @confirmEvent="cardReader"
          ></hl-keyboard>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: ['scenes', 'dense', 'navType'],
  data () {
    return {
      userData: {},
      card_number: '',
      rfid1: '1',
      rfid2: '1',
      rfid3: '1',
      readJsUrl: 'http://127.0.0.1:8008/YOWOCloudRFIDReader.js',
      cardReaderStatus: false,
      openPlugins: []
    }
  },
  created: function () {},
  mounted () {
    this.focusInput()
    this.openPlugins = this.$q.localStorage.getItem('onlystore_plugins_local').openPlugins
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
              this.cardReaderStatus = false
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
              this.$emit('readError')
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
              this.$emit('readError')
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
    },
    openCardReader () {
      this.cardReaderStatus = true
      setTimeout(() => {
        this.focusInput()
      }, 500)
    }
  }
}
</script>
