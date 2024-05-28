<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2 q-mt-xs">
      <div style="overflow-y: scroll" class="fit full-height bg-white">
        <q-form ref="addSettingRef">
          <div class="q-mt-sm row q-px-md">
            <div class="col-7">
              <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                微信公众号客服
              </div>
              <q-separator class="q-mx-sm q-mb-sm" />
              <div class="q-mb-md q-px-sm">
                <q-input outlined label="企业ID" dense v-model="settingForm.js_qw_wechat_corpId" lazy-rules />
              </div>
              <div class="q-mb-md q-px-sm">
                <q-input outlined label="企微客服URL" dense v-model="settingForm.js_qw_wechat_url" lazy-rules />
              </div>
            </div>

            <div class="col-7">
              <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                微信小程序客服
              </div>
              <q-separator class="q-mx-sm q-mb-sm" />
              <div class="q-mb-md q-px-sm col-6">
                <q-input outlined label="企业ID" dense v-model="settingForm.js_qw_wxapp_corpId" lazy-rules />
              </div>
              <div class="q-mb-md q-px-sm col-6">
                <q-input outlined label="企微客服URL" dense v-model="settingForm.js_qw_wxapp_url" lazy-rules />
              </div>
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn class="q-px-xl" label="提交" :disable="submitDisable" @click="saveData()" color="primary" unelevated />
    </div>
  </div>
</template>
<script>
export default {
  name: 'jfmallSetting',
  components: {},
  data () {
    return {
      settingForm: {
        js_name: '',
        js_logo: '',
        js_description: '',
        js_contact_people: '',
        js_contact_phone: '',
        js_address: '',
        js_evaluation_rules: '',
        js_service_description: '',
        js_qw_wechat_url: '',
        js_qw_wxapp_url: '',
        js_qw_wechat_corpId: '',
        js_qw_wxapp_corpId: '',
        js_hot_tags: [],
        js_delivery_way: [],
        js_is_auto_delivery: '',
        js_send_set: {},
        js_refund_set: {},

        js_lng: '',
        js_lat: '',

        js_wechat_message_config: {},
        js_comment_item: {},
        js_refund_why: {},
        js_pay_set: {
          pointSwitch: 0,
          pointRatio: '',
          levelSwitch: 0,
          moneyCashSwitch: 0,
          moneyCashRatio: '',
          moneyGivePointSwitch: 0,
          moneyGivePointRatio: '',
          pointCashSwitch: 0,
          pointCashRatio: '',
          pointUseCashSwitch: 0,
          pointUseCashSRatio: ''
        }
      },
      submitDisable: false,
      multiple: false,
      uploadImgStatus: false,
      addressMap: false,
      currentTag: '',
      messageConfig: {
        orderTemp: '',
        orderState: '0',
        storeOrderTemp: '',
        storeOrderState: '0'
      },
      commentItem: {
        one: '',
        two: '',
        three: ''
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
      this.$store.dispatch('jfSetting/getItem', null).then((res) => {
        if (parseInt(res.code) == 200) {
          if (res.data) {
            this.settingForm = res.data ? res.data : {}
          }
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.addSettingRef.validate().then((success) => {
        if (success) {
          this.submitDisable = true
          const obj = {
            ...this.settingForm
          }
          this.$store
            .dispatch('jfSetting/setData', obj)
            .then((res) => {
              if (parseInt(res.code) == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '修改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.submitDisable = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.submitDisable = false
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
              this.submitDisable = false
            })
        }
      })
    }

  }
}
</script>
