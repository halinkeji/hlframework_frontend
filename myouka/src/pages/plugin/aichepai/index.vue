<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-h6">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础信息
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white q-mt-sm">
        <q-scroll-area class="fit full-height">
          <div class="text-red q-px-md">
            参考: https://market.aliyun.com/products/57124001/cmapi032750.html?spm=5176.730005.result.2.68313524iijMeu#sku=yuncode2675000001
          </div>
          <q-form ref="aliPayRef">
            <div class="col-8 col-md-6 q-ml-md"></div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-select
                  class="col-12 col-md-2"
                  outlined
                  label="功能开关"
                  bottom-slots
                  v-model="aiApiConfig.pac_status"
                  :options="[
                    { label: '开启', value: 1 },
                    { label: '关闭', value: 0 },
                  ]"
                  dense
                  emit-value
                  map-options
                >
                  <template v-slot:hint> 功能开关 </template>
                </q-select>
              </div>
            </div>

            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="AppKey" :rules="[(val) => !!val || '必填项']" v-model="aiApiConfig.pac_app_key" maxlength="100" placeholder="AccessKeyID">
                  <template v-slot:hint> 填写AppKey </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="AppSecret" :rules="[(val) => !!val || '必填项']" v-model="aiApiConfig.pac_app_secret" placeholder="AppSecret" maxlength="150">
                  <template v-slot:hint>
                    填写AppSecret
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="AppCode" :rules="[(val) => !!val || '必填项']" v-model="aiApiConfig.pac_app_code" maxlength="150" placeholder="AppCode">
                  <template v-slot:hint>填写 AppCode </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-sm q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="提交" @click="saveData" color="primary" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'aichepai',
  components: {},
  data () {
    return {
      aiApiConfig: {
        pac_app_key: '',
        pac_app_secret: '',
        pac_app_code: '',
        pac_status: 0
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
      this.$store.dispatch('aiChePai/getItem').then((res) => {
        if (res.code == 200 && res.data) {
          this.aiApiConfig = res.data
          this.aiApiConfig.pac_status = parseInt(res.data.pac_status)
        }
      })
    },
    // 提交
    saveData () {
      this.$refs.aliPayRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.aiApiConfig
          }
          this.$store
            .dispatch('aiChePai/addData', obj)
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
