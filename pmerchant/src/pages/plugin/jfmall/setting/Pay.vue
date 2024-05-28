<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2 q-mt-xs">
      <div style="overflow-y: scroll" class="fit full-height bg-white">
        <q-form ref="addSettingRef">
          <div class="q-mt-sm row q-px-md">
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1"
                    >{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}支付单笔可用百分比</span
                  >
                  <q-toggle v-model="settingForm.js_pay_set.moneyCashSwitch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <div class="q-ma-md">
                  启用后，会员使用{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}结账时，单笔可使用{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit
                  }}总额的百分比。如：增加计次结账，选择{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit
                  }}，会根据如下设置的百分比自动计算出本次交易可使用的{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit
                  }}金额数。<br />
                  示例：某会员张三一共有{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}100{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit
                  }}，商家设置的可用百分比为80，那么假设张三本次消费实付总金额300{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit
                  }}，则张三只能使用总{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}的（100*80%=80{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit
                  }}）。设置范围为1~100。
                </div>
                <q-input
                  outlined
                  bottom-slots
                  v-model="settingForm.js_pay_set.moneyCashRatio"
                  dense
                  class="q-px-md"
                  :rules="[(val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 1 && val <= 100 : true) || '请输入正确的数值']"
                >
                </q-input>
              </q-card>
            </div>

            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1"
                    >{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}支付单笔可用百分比</span
                  >
                  <q-toggle v-model="settingForm.js_pay_set.pointCashSwitch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <div class="q-ma-md">
                  启用后，会员使用{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}结账时，单笔可使用{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}总额的百分比。如：增加计次结账，选择{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}，会根据如下设置的百分比自动计算出本次交易可使用的{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}总数。<br />
                  示例：某会员张三一共有1000{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}，商家设置的可用百分比为80，则张三本单交易只能使用总{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}的（1000*80%=800{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}）。设置范围为1~100。
                </div>
                <q-input
                  outlined
                  bottom-slots
                  v-model="settingForm.js_pay_set.pointCashRatio"
                  dense
                  :rules="[(val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 1 && val <= 100 : true) || '请输入正确的数值']"
                  class="q-px-md"
                >
                </q-input>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1"
                    >{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}支付抵现换算比例</span
                  >
                  <q-toggle
                    v-model="settingForm.js_pay_set.pointUseCashSwitch"
                    color="green"
                    :true-value="'1'"
                    :false-value="'0'"
                    class="float-right"
                  />
                </q-card-section>
                <q-separator />
                <div class="q-ma-md">
                  启用后，会员使用{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}结账时，{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}换算货币比例。如：增加计次结账，选择{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}，会根据如下设置的比率自动计算出本次交易{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}可抵现总金额。<br />
                  示例：某会员张三本单消费可用{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}为 100
                  {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}，商家设置{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}抵现换算比例为30 ，则张三本单交易按（30{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                  }}
                  = 1{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit }}）换算可抵现总金额（100 × (1÷30)) =
                  3.33 {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit }}）。 设置范围为大于等于1。
                </div>
                <q-input
                  outlined
                  bottom-slots
                  v-model="settingForm.js_pay_set.pointUseCashSRatio"
                  dense
                  class="q-px-md"
                  :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
                >
                </q-input>
              </q-card>
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
