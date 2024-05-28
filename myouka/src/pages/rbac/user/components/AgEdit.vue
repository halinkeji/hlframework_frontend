<template>
  <div class="row q-gutter-sm">
    <q-btn
      unelevated
      color="indigo"
      @click="setBindClient"
      flat
      icon="las la-user-check"
      v-if="parseInt(params.data.id) > 0 && parseInt(params.data.status) >= 0 && authorityMeta('client')"
    >
      <q-tooltip :offset="[10, 10]"> 终端绑定 </q-tooltip>
    </q-btn>
    <q-btn
      unelevated
      color="orange"
      @click="setUserInfo"
      flat
      icon="las la-user-edit"
      v-if="parseInt(params.data.id) > 0 && parseInt(params.data.status) >= 0 && authorityMeta('info')"
    >
      <q-tooltip :offset="[10, 10]"> 用户信息 </q-tooltip>
    </q-btn>
    <q-btn
      unelevated
      color="secondary"
      @click="bindExtendInfo"
      flat
      icon="las la-user-cog"
      v-if="parseInt(params.data.id) > 0 && parseInt(params.data.status) >= 0 && authorityMeta('extend')"
    >
      <q-tooltip :offset="[10, 10]"> 用户设置 </q-tooltip>
    </q-btn>

    <q-btn
      unelevated
      color="orange"
      @click="bindUseStore"
      flat
      icon="las la-store"
      v-if="parseInt(params.data.id) > 0 && parseInt(params.data.status) >= 0 && authorityMeta('bindStore')"
    >
      <q-tooltip :offset="[10, 10]"> 绑定管理商户 </q-tooltip>
    </q-btn>
    <q-btn
      unelevated
      color="warning"
      :to="{
        name: 'bindRole',
        query: { user_id: params.data.user_id },
      }"
      flat
      icon="device_hub"
      v-if="parseInt(params.data.id) > 0 && parseInt(params.data.status) >= 0 && authorityMeta('role')"
    >
      <q-tooltip :offset="[10, 10]"> 权限 </q-tooltip>
    </q-btn>

    <q-btn class="col-auto" unelevated color="primary" flat icon="las la-edit" v-if="authorityMeta('edit')" @click="editRecord">
      <q-tooltip :offset="[10, 10]"> 编辑 </q-tooltip>
    </q-btn>
    <q-btn unelevated color="red" icon="las la-trash-alt" v-if="params.data.status == -1 && authorityMeta('del')" flat @click="confirmDelete">
      <q-tooltip :offset="[10, 10]"> 删除 </q-tooltip>
    </q-btn>
    <q-btn unelevated color="red-10" icon="las la-lock" @click="confirmDeleteRecord" flat v-if="authorityMeta('locking') && params.data.status > -1">
      <q-tooltip :offset="[10, 10]"> 禁用 </q-tooltip>
    </q-btn>
    <q-btn
      icon="las la-unlock"
      unelevated
      color="orange-9"
      v-if="params.data.status == -1 && authorityMeta('unlock')"
      @click="confirmRestoreUser"
      flat
    >
      <q-tooltip :offset="[10, 10]"> 启用 </q-tooltip>
    </q-btn>
    <q-btn icon="vpn_key" unelevated v-if="authorityMeta('password')" color="blue-grey" @click="updatePassword" flat>
      <q-tooltip :offset="[10, 10]"> 修改密码 </q-tooltip>
    </q-btn>

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
        <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
          <q-input
            outlined
            dense
            v-model="user_data.nowPassword"
            label="旧密码"
            no-error-icon
            :type="isOldPwd ? 'password' : 'text'"
            :rules="[(val) => !!val || '请输入旧密码']"
          >
          </q-input>
          <q-input
            outlined
            dense
            v-model="user_data.password"
            label="密码"
            type="password"
            lazy-rules
            :error="confirmPassword"
            :error-message="'密码二次输入有误'"
          />
          <q-input
            outlined
            dense
            v-model="user_data.confirmPassword"
            label="确认密码"
            type="password"
            lazy-rules
            :error="confirmPassword"
            :error-message="'密码二次输入有误'"
          />

          <div class="text-center q-gutter-sm">
            <q-btn label="保存" unelevated :disable="clickBtnDisabled" @click="saveChanges" class="q-px-xl" color="primary" />
            <q-btn label="关闭" unelevated v-close-popup color="grey" class="q-px-xl" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgEdit',
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
      isOldPwd: true
    }
  },
  mounted () {},
  computed: {
    confirmPassword () {
      if (this.user_data.password != this.user_data.confirmPassword) {
        return true
      }
      return false
    }
  },
  methods: {
    setUserInfo () {
      this.$nextTick(() => {
        this.params.context.setUserInfo(this.params.data.id)
      })
    },
    setBindClient () {
      this.$nextTick(() => {
        this.params.context.setBindClient(this.params.data.id)
      })
    },

    editRecord () {
      this.$nextTick(() => {
        this.params.context.addOrUpdate(this.params.data.id)
      })
    },

    bindExtendInfo () {
      this.$nextTick(() => {
        this.params.context.bindExtendInfo(this.params.data.id)
      })
    },
    bindUseStore () {
      this.$nextTick(() => {
        this.params.context.bindUseStore(this.params.data.id)
      })
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `确定禁用 ${this.params.data.username}?`,
          ok: {
            push: true,
            color: 'negative'
          },
          cancel: {
            push: true,
            color: 'primary'
          },
          persistent: true
        })
        .onOk(() => {
          if (parseInt(this.params.data.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '禁用用户信息失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          const payload = {
            id: parseInt(this.params.data.id),
            status: -1
          }

          this.$store
            .dispatch('user/setUserInfo', payload)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '用户禁用至回收站成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getUserList()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '用户禁用至回收站失败，请联系管理员！',
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
        })
        .onCancel(() => {})
    },

    confirmRestoreUser () {
      this.$q
        .dialog({
          title: '确定',
          message: `确定恢复 ${this.params.data.username} 信息?`,
          ok: {
            push: true,
            color: 'negative'
          },
          cancel: {
            push: true,
            color: 'primary'
          },
          persistent: true
        })
        .onOk(() => {
          if (parseInt(this.params.data.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '恢复用户信息失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          const payload = {
            id: parseInt(this.params.data.id),
            status: 1
          }

          this.$store
            .dispatch('user/setUserInfo', payload)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '用户恢复信息成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getUserList()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '用户恢复信息失败，请联系管理员！',
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
        })
        .onCancel(() => {})
    },

    updatePassword () {
      this.user_data.id = parseInt(this.params.data.id)
      this.updatePasswordPopup = true
    },

    saveChanges () {
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
            setTimeout(() => {
              this.user_data = {
                password: '',
                confirmPassword: '',
                id: 0,
                nowPassword: ''
              }
              this.clickBtnDisabled = false
              this.updatePasswordPopup = false
            }, 500)
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.clickBtnDisabled = false
            }, 500)
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

    confirmDelete () {
      this.$q
        .dialog({
          title: '确定',
          message: `确定删除 ${this.params.data.username} ?删除之后不可恢复！`,
          ok: {
            push: true,
            color: 'negative'
          },
          cancel: {
            push: true,
            color: 'primary'
          },
          persistent: true
        })
        .onOk(() => {
          if (parseInt(this.params.data.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '用户删除失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          this.$store
            .dispatch('user/delUserInfo', parseInt(this.params.data.id))
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '用户删除成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getUserList()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '用户删除失败，请联系管理员！',
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
        })
        .onCancel(() => {})
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
