<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-sm q-py-xs text-center">
        <q-tabs v-model="config_type" @input="getItem" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="wechat" label="微信公众号支付" />
          <q-tab name="wxapp" label="微信小程序支付" />
        </q-tabs>
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="wechatPayRef">
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label=" 公众账号ID(appid)" :rules="[(val) => !!val || '必填项']" v-model="wxpayData.app_id" maxlength="50" placeholder=" 公众账号ID(appid)">
                  <template v-slot:hint>
                    填写(本公众号/服务商/小程序)公众账号ID(appid)
                  </template></q-input
                >
              </div>
            </div>
            <!-- <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="公众账号AppSecret" :rules="[(val) => !!val || '必填项']" v-model="wxpayData.app_secret" placeholder="公众账号AppSecret" maxlength="50"
                  ><template v-slot:hint>
                    填写(本公众号/服务商/小程序))公众账号AppSecret
                  </template></q-input
                >
              </div>
            </div> -->
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="商户号(mchid)" :rules="[(val) => !!val || '必填项']" v-model="wxpayData.mch_id" maxlength="50" placeholder="商户号(mchid)">
                  <template v-slot:hint> 填写商户号(mchid) </template>
                </q-input>
              </div>
            </div>

            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="商户支付密钥key" :rules="[(val) => !!val || '必填项']" v-model="wxpayData.app_key" maxlength="50" placeholder="(本公众号/服务商)商户支付密钥key">
                  <template v-slot:hint>
                    填写(本公众号/服务商/小程序))商户支付密钥key
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-select
                  class="col-12 col-md-2"
                  outlined
                  label="是否特约子商户账户"
                  bottom-slots
                  v-model="wxpayData.is_son"
                  :options="[
                    { label: '开启', value: 1 },
                    { label: '关闭', value: 0 },
                  ]"
                  dense
                  emit-value
                  map-options
                >
                  <template v-slot:hint> 是否特约子商户账户 </template>
                </q-select>
              </div>
            </div>
            <div v-if="wxpayData.is_son == 1">
              <div class="row q-my-sm">
                <div class="col-8 col-md-6 q-ml-md">
                  <q-input outlined dense label="公众账号ID(appid)" :rules="[(val) => !!val || '必填项']" v-model="wxpayData.sub_appid" placeholder="(特约子商户)公众账号ID(sub_appid)">
                    <template v-slot:hint>
                      填写(特约子商户)公众账号ID(sub_appid)
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row q-my-sm">
                <div class="col-8 col-md-6 q-ml-md">
                  <q-input outlined dense label=" 商户号(mchid)" :rules="[(val) => !!val || '必填项']" v-model="wxpayData.sub_mch_id" placeholder="(特约子商户)商户号(mchid)">
                    <template v-slot:hint> 填写(特约子商户)商户号(mchid) </template>
                  </q-input>
                </div>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
        <q-btn class="q-px-xl" label="提交" v-if="authorityMeta('save')" @click="saveData" unelevated color="primary" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'wxpay',
  components: {},
  data () {
    return {
      config_type: 'wechat',
      wxpayData: {
        app_id: '',
        app_secret: '',
        config_type: '',
        mch_id: '',
        app_key: '',
        notify_url: '',
        is_son: 0,
        sub_appid: '',
        sub_AppSecret: '',
        sub_mch_id: ''
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
      this.$store
        .dispatch('wxPay/getItem', {
          config_type: this.config_type
        })
        .then((res) => {
          if (res.code == 200) {
            this.wxpayData = res.data
              ? res.data
              : {
                  app_id: '',
                  app_secret: '',
                  config_type: '',
                  mch_id: '',
                  app_key: '',
                  notify_url: '',
                  is_son: 0,
                  sub_appid: '',
                  sub_AppSecret: '',
                  sub_mch_id: ''
                }
            this.wxpayData.is_son = parseInt(this.wxpayData.is_son)
          }
        })
    },
    // 提交
    saveData () {
      this.$refs.wechatPayRef.validate().then((success) => {
        if (success) {
          if (this.wxpayData.is_sub_mchid == 2) {
            this.wxpayData.sub_appid = ''
            this.wxpayData.sub_mch_id = ''
            this.wxpayData.sub_mch_id = ''
          }
          this.wxpayData.config_type = this.config_type
          const obj = {
            ...this.wxpayData
          }
          this.$store
            .dispatch('wxPay/addData', obj)
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
