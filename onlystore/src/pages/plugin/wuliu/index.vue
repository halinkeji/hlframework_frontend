<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础信息
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white ">
        <q-scroll-area class="fit full-height">

          <q-form ref="wuliuRef">
            <div class="col-8 col-md-6 q-ml-md"></div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-select
                  class="col-12 col-md-2"
                  outlined
                  label="功能开关"
                  bottom-slots
                  v-model="wuliuApiConfig.pwc_status"
                  :options="[
                    { label: '开启', value: 1 },
                    { label: '关闭', value: -1 },
                  ]"
                  dense
                  emit-value
                  map-options
                >
                  <template v-slot:hint> 功能开关 </template>
                  <template v-slot:after >
                    <q-btn
                      color="primary"
                      unelevated
                      @click="goPage('https://market.aliyun.com/products/57126001/cmapi021863.html?spm=5176.730005.result.10.24b73524i5OSSi#sku=yuncode1586300000')"
                      icon-right="las la-question-circle"
                      label="阿里云接口购买地址"
                    />
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input
                  outlined
                  dense
                  label="AppKey"
                  :rules="[(val) => !!val || '必填项']"
                  v-model="wuliuApiConfig.pwc_app_key"
                  maxlength="100"
                  placeholder="AccessKeyID"
                >
                  <template v-slot:hint> 填写AppKey </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input
                  outlined
                  dense
                  label="AppSecret"
                  :rules="[(val) => !!val || '必填项']"
                  v-model="wuliuApiConfig.pwc_app_secret"
                  placeholder="AppSecret"
                  maxlength="150"
                >
                  <template v-slot:hint>
                    填写AppSecret
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input
                  outlined
                  dense
                  label="AppCode"
                  :rules="[(val) => !!val || '必填项']"
                  v-model="wuliuApiConfig.pwc_app_code"
                  maxlength="150"
                  placeholder="AppCode"
                >
                  <template v-slot:hint>填写 AppCode </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="提交" v-if="authorityMeta('save')" @click="saveData" color="primary" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'wuliu',
  components: {},
  data () {
    return {
      wuliuApiConfig: {
        pwc_app_key: '',
        pwc_app_secret: '',
        pwc_app_code: '',
        pwc_status: 1
      }
    }
  },
  created () {
    this.getItem()
  },
  mounted () {},
  computed: {},
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('wuliu/getItemData').then((res) => {
        if (res.code == 200 && res.data) {
          this.wuliuApiConfig = res.data ? res.data : {}
          this.wuliuApiConfig.pwc_status = parseInt(res.data.pwc_status)
        }
      })
    },
    // 提交
    saveData () {
      this.$refs.wuliuRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.wuliuApiConfig
          }
          this.$store
            .dispatch('wuliu/setData', obj)
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
    goPage (val) {
      if (val) {
        window.open(val)
      }
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
