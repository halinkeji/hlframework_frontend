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
        <div>账户管理</div>
        <q-separator class="q-my-xs" />
        <q-form autocorrect="off" ref="userFormRef" autocapitalize="off" autocomplete="off" spellcheck="false">

         <q-input
            outlined
            dense
            v-model="user_data.mobile"
            label="管理账号"
            no-error-icon
            disable
            bottom-slots
            hint="初始密码与账号相同"
          >
          </q-input>
           <q-input
            outlined
            dense
            v-model="user_data.password"
            label="新密码"
            no-error-icon
            v-if="resetPassword"
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
            v-if="resetPassword"
            :type="confirmPwd ? 'password' : 'text'"
            :rules="[(val) => !!val || '请输入确认密码', (val) => val == user_data.password || '两次输入密码不一致']"
          >
            <template v-slot:append>
              <q-icon :name="confirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="confirmPwd = !confirmPwd" />
            </template>
          </q-input>

           <div class="text-grey text-caption">
              <q-icon name="las la-exclamation-circle"  color="grey" /> 说明：此账号是商家超级管理员账号，支持PC网页版、win版、APP商家版，三端均可登录管理软件。
            </div>

          <div class="row text-center q-gutter-sm justify-center">
            <q-btn label="重置密码" v-if="!resetPassword" unelevated  @click="resetPassword = true" class="q-px-sm" color="negative" />
            <q-btn label="保存"  v-if="resetPassword" unelevated :disable="clickBtnDisabled" @click="saveChanges" class="q-px-sm" color="primary" />
            <q-btn label="关闭" unelevated v-close-popup color="grey" @click="closeDialog" class="q-px-sm" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
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
      resetPassword: false
    }
  },
  mounted () {},
  computed: {},
  methods: {
    updatePassword (mobile) {
      this.updatePasswordPopup = true

      if (mobile) {
        this.getUserInfo(mobile)
      }
    },

    getUserInfo (mobile) {
      this.$store
        .dispatch('user/getMobileUserInfo', {
          mobile
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.user_data = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: '信息获取异常！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
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
    },

    saveChanges () {
      this.$refs.userFormRef.validate().then((success) => {
        if (success) {
          const payload = {
            id: this.user_data.id,
            password: this.user_data.password,
            confirmPassword: this.user_data.confirmPassword

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
