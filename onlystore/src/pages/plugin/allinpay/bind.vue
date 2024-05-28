<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        申请商户信息
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white q-mt-sm">
        <q-scroll-area class="fit full-height">
          <q-form ref="allinpayPayRef">
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="绑定bizUserId" :rules="[(val) => !!val || '必填项']" disable v-model="allinPayData.pac_biz_user_id" maxlength="20" placeholder="绑定bizUserId">
                  <template v-slot:hint> 填写绑定bizUserId </template>

                  <template v-slot:after v-if="!allinPayData.pac_biz_user_id">
                    <q-btn color="primary" @click="createMember" unelevated label="生成" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="电话号" :rules="[(val) => !!val || '必填项']" v-model="userData.merchantPhone" placeholder="电话号" maxlength="20">
                  <template v-slot:hint>
                    填写电话、发送验证码
                  </template>
                  <template v-slot:after v-if="allinPayData.pac_biz_user_id">
                    <q-btn color="primary" @click="clickSendSmsCode" unelevated v-if="!userData.sendSmsCodeStatus" label="发送验证码" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="验证码" :rules="[(val) => !!val || '必填项']" v-model="userData.sendSmsCode" maxlength="50" placeholder="验证码">
                  <template v-slot:hint> 输入手机验证码 </template>
                  <template v-slot:after v-if="allinPayData.pac_biz_user_id">
                    <q-btn color="primary" @click="clickBindPhone" unelevated v-if="!userData.bindPhoneStatus" label="绑定电话" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="实名认证真实姓名" :rules="[(val) => !!val || '必填项']" v-model="userData.userRealName" placeholder="实名认证真实姓名">
                  <template v-slot:hint> 填写实名认证真实姓名 </template>
                </q-input>
              </div>
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="实名认证真实身份证" :rules="[(val) => !!val || '必填项']" v-model="userData.userRealIdCard" placeholder="实名认证真实身份证">
                  <template v-slot:hint> 填写实名认证真实身份证 </template>
                  <template v-slot:after v-if="allinPayData.pac_biz_user_id">
                    <q-btn color="primary" @click="setRealName" v-if="!userData.realNameStatus"  unelevated label="认证" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="实名填写银行卡号" :rules="[(val) => !!val || '必填项']" v-model="userData.bankCardNo" placeholder="实名填写银行卡号">
                  <template v-slot:hint> 填写银行卡号 </template>
                  <template v-slot:after v-if="allinPayData.pac_biz_user_id">
                    <q-btn color="primary" @click="bindBankCard" unelevated  v-if="!userData.bindBankCardStatus" label="绑定" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'allinpay',
  components: {},
  data () {
    return {
      allinPayData: {
        pac_company_id: '',
        pac_app_id: '',
        pac_secret_key: '',
        pac_pfx_path: '',
        pac_pfx_password: '',
        pac_cer_path: '',
        pac_sys_id: '',
        pac_bind_status: 0,
        pac_bind_info: {}
      },
      userData: {
        bizUserId: '',
        merchantPhone: '',
        sendSmsCodeStatus: false,
        sendSmsCode: '',
        bindPhoneStatus: false,
        userRealName: '',
        userRealIdCard: '',
        realNameStatus: false,
        signContractUrl: '',
        bankCardNo: '',
        bindBankCardStatus: false
      }
    }
  },
  mounted () {},
  created () {
    this.getItem()
  },
  computed: {},
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('allinpay/getItem').then((res) => {
        if (res.code == 200) {
          this.allinPayData = res.data ? res.data : {}
          this.userData = this.allinPayData.pac_bind_info
            ? JSON.parse(this.allinPayData.pac_bind_info)
            : {
                bizUserId: '',
                merchantPhone: '',
                sendSmsCodeStatus: false,
                sendSmsCode: '',
                bindPhoneStatus: false,
                userRealName: '',
                userRealIdCard: '',
                realNameStatus: false,
                signContractUrl: '',
                bankCardNo: '',
                bindBankCardStatus: false
              }
          this.userData.bizUserId = this.allinPayData.pac_biz_user_id
        }
      })
    },
    createMember () {
      this.$store.dispatch('allinpay/createMember', {
        ...this.userData
      }).then((res) => {
        if (res.code == 200) {
          this.getItem()
        }
      })
    },
    clickSendSmsCode () {
      this.$store
        .dispatch('allinpay/sendSmsCode', {
          ...this.userData
        })
        .then((res) => {
          if (res.code == 200) {
            this.userData.sendSmsCodeStatus = res.data
          }
        })
    },
    clickBindPhone () {
      this.$store
        .dispatch('allinpay/bindPhone', {
          ...this.userData
        })
        .then((res) => {
          if (res.code == 200) {
            this.userData.bindPhoneStatus = res.data
          }
        })
    },
    setRealName () {
      this.$store
        .dispatch('allinpay/setRealName', {
          ...this.userData
        })
        .then((res) => {
          if (res.code == 200) {
            this.userData.realNameStatus = res.data
            if (this.userData.realNameStatus) {
              this.getSignContract()
            }
          }
        })
    },

    getSignContract () {
      this.$store
        .dispatch('allinpay/getSignContract', {
          ...this.userData
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.userData.signContractUrl = res.data

            this.userData.bindBankCardStatus = false

            window.open(res.data)
          }
        })
    },

    bindBankCard () {
      this.$store
        .dispatch('allinpay/bindBankCard', {
          ...this.userData
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.getItem()
          }
        })
    },

    // 提交
    saveData () {
      this.$refs.allinpayPayRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.allinPayData
          }
          this.$store
            .dispatch('allinpay/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
                  color: 'green'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
