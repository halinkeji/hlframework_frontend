<template>
  <div class="row justify-end">
    <q-dialog v-model="updatePasswordPopup">
      <q-card
        :style="{
          width: $q.screen.width * 0.2 + 'px',
          'max-width': $q.screen.width * 0.2 + 'px',
        }"
        flat
        class="q-pa-md"
      >
        <div>修改密码</div>
        <q-separator class="q-my-xs" />
        <q-form autocorrect="off" ref="userFormRef" autocapitalize="off" autocomplete="off" spellcheck="false">
         <q-input
            outlined
            dense
            v-model="user_data.nowPassword"
            label="旧密码"
            no-error-icon
            :type="isOldPwd ? 'password' : 'text'"
            :rules="[(val) => !!val || '请输入旧密码']"
          >
            <template v-slot:append>
              <q-icon :name="isOldPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isOldPwd = !isOldPwd" />
            </template>
          </q-input>
           <q-input
            outlined
            dense
            v-model="user_data.password"
            label="新密码"
            no-error-icon
            :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => !!val || '请输入新密码', (val) => val == user_data.confirmPassword || '两次输入密码不一致']"
          >
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <q-input
            outlined
            dense
            v-model="user_data.confirmPassword"
            label="确认密码"
            no-error-icon
            :type="confirmPwd ? 'password' : 'text'"
            :rules="[(val) => !!val || '请输入确认密码', (val) => val == user_data.password || '两次输入密码不一致']"
          >
            <template v-slot:append>
              <q-icon :name="confirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="confirmPwd = !confirmPwd" />
            </template>
          </q-input>

           <q-input
              outlined
              dense
              v-model="localUserInfo.mobile"
              label="手机号"
              disable
              lazy-rules
              bottom-slots

            />

          <q-input
            outlined
            v-model="smsCode"
            dense
            maxlength="6"
            no-error-icon
            placeholder="短信验证码"
            :rules="[(val) => (val && val.length > 0) || '请输入短信验证码']"
          >
            <template v-slot:prepend>
              <q-icon name="mail_outline" />
            </template>
            <template v-slot:append>
              <q-btn
                flat
                @click="sendSmsCode"
                color="gery"
                :disable="smsSendDisableStatus"
                :label="smsSendStatus"
              />
            </template>
          </q-input>

          <div class="text-center q-gutter-sm">
            <q-btn label="保存" unelevated :disable="clickBtnDisabled" @click="saveChanges" class="q-px-xl" color="primary" />
            <q-btn label="关闭" unelevated v-close-popup color="grey" @click="closeDialog" class="q-px-xl" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
const md5 = require('md5')
export default {
  name: 'UpatePassword',
  data () {
    return {
      user_data: {
        password: '',
        confirmPassword: '',
        id: 0,
        nowPassword: ''
      },
      updatePasswordPopup: false,
      clickBtnDisabled: false,
      isPwd: true,
      isOldPwd: true,
      confirmPwd: true,
      smsCode: '',
      smsSendDisableStatus: false,
      countDownNumber: 60,
      smsSendStatus: '发送验证码',
      smsRecordCode: '',
      localUserInfo: {}

    }
  },
  mounted () {},
  computed: {},
  methods: {
    updatePassword () {
      const accountInfo = this.$q.localStorage.getItem('oneyouka_account_info')
      this.user_data.id = accountInfo.user_id

      const userInfo = this.$q.localStorage.getItem('oneyouka_user_info')
      this.localUserInfo = userInfo

      this.updatePasswordPopup = true
    },

    saveChanges () {
      this.$refs.userFormRef.validate().then((success) => {
        if (success) {
          if (md5(this.smsCode) != this.smsRecordCode) {
            this.$q.notify({
              message: '失败',
              caption: '验证码错误',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          const payload = {
            ...this.user_data
          }
          this.clickBtnDisabled = true
          this.$store
            .dispatch('user/setUserInfo', payload)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '用户密码更改成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.closeDialog()
              } else {
                this.clickBtnDisabled = false
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.clickBtnDisabled = false
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },

    sendSmsCode () {
      if (!(this.localUserInfo && this.localUserInfo.mobile)) {
        this.$q.notify({
          message: '失败',
          caption: '未检测电话号',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.smsSendDisableStatus = true
      const obj = {
        phoneNumber: this.localUserInfo.mobile
      }
      this.$store
        .dispatch('smsMarket/sendPhoneCode', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.smsRecordCode = res.data

            this.clockDown = window.setInterval(() => {
              this.countDownNumber--
              this.smsSendStatus = this.countDownNumber + '秒后重新发送'
              if (this.countDownNumber < 0) {
                window.clearInterval(this.clockDown)
                this.smsSendStatus = '重新发送验证码'
                this.countDownNumber = 60
                this.smsSendDisableStatus = false
              }
            }, 1000)
          } else {
            this.smsSendDisableStatus = false
            this.$q.notify({
              message: '失败',
              caption: '发送验证码失败！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'center'
            })
          }
        })
        .catch((error) => {})
    },

    closeDialog () {
      this.clickBtnDisabled = false

      this.$emit('closeDialog')
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
