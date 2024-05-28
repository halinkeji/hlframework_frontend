<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础信息
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white q-my-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="ttlockConfigFormRef" class="row q-gutter-sm">
            <div class="col-6">
              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label>启用通通锁功能</q-item-label>
                  <q-item-label caption>开启后，桌台可以选择通通锁的【门锁设备】</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-toggle v-model="sdcStatus" color="green" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                label="clientId"
                :rules="[(val) => !!val || '必填项']"
                v-model="ttlockConfigData.clientId"
                maxlength="100"
                hint="创建应用分配的clientId"
              >
              </q-input>
            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                label="clientSecret"
                :rules="[(val) => !!val || '必填项']"
                v-model="ttlockConfigData.clientSecret"
                hint="创建应用分配的clientSecret"
                maxlength="100"
              >
              </q-input>
            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                label="登录账号"
                :rules="[(val) => !!val || '必填项']"
                v-model="ttlockConfigData.username"
                maxlength="100"
                hint="通通锁或通通锁APP的登录账号，也可以是注册用户接口返回的账号。注意：请别使用开发者账号。"
              >
              </q-input>
            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                label="账号密码"
                :rules="[(val) => !!val || '必填项']"
                v-model="ttlockConfigData.password"
                hint="md5加密后的密码"
                maxlength="100"
              >
              </q-input>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white  q-py-sm text-center ">
        <q-btn class="q-px-xl" unelevated label="提交" @click="saveData" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'tt-lock',
  data () {
    return {
      ttlockConfigData: {
        clientId: '',
        clientSecret: '',
        username: '',
        password: ''
      },
      sdcStatus: '0'
    }
  },
  mounted () {
    this.getConfigData()
  },
  created () {},
  computed: {},
  methods: {
    getConfigData () {
      this.$store
        .dispatch('ttlockManage/getConfigData', {})
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.ttlockConfigData = res.data.sdc_config
              ? res.data.sdc_config
              : {
                  clientId: '',
                  clientSecret: '',
                  username: '',
                  password: ''
                }
            this.sdcStatus = res.data.sdc_status
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
    },

    // 提交
    saveData () {
      this.$refs.ttlockConfigFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ttlockConfigData: this.ttlockConfigData,
            sdc_status: this.sdcStatus
          }
          this.$store
            .dispatch('ttlockManage/setConfigData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '保存配置成功',
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
