<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础信息
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white q-mt-sm">
        <q-scroll-area class="fit full-height">
          <q-form ref="allinpayPayRef">
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="账户集" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_account_set_no" placeholder="账户集"></q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="企业ID" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_company_id" maxlength="20" placeholder="企业ID">
                  <template v-slot:hint> 填写企业ID </template></q-input
                >
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="开放平台appId" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_app_id" placeholder="开放平台appId" maxlength="20"
                  ><template v-slot:hint>
                    填写开放平台appId
                  </template></q-input
                >
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="应用secretKey" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_secret_key" maxlength="50" placeholder="应用secretKey">
                  <template v-slot:hint> 填写应用secretKey </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="应用私钥证书路径" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_pfx_path" placeholder="应用私钥证书路径">
                  <template v-slot:hint> 填写应用私钥证书路径 </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="对应平台账户sysid" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_sys_id" placeholder="对应平台账户sysid">
                  <template v-slot:hint> 填写对应平台账户sysid </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="应用私钥证书密码" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_pfx_password" type="password" placeholder="应用私钥证书密码">
                  <template v-slot:hint> 填写应用私钥证书密码 </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="开放平台公钥证书" :rules="[(val) => !!val || '必填项']" v-model="allinPayData.pac_cer_content"> </q-input>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-sm q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="提交" v-if="authorityMeta('save')" @click="saveData" color="primary" />
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
        pac_sys_id: ''
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
