<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2 q-mt-xs">
      <div style="overflow-y: scroll" class="fit full-height bg-white">
        <q-form ref="addSettingRef">
          <div class="q-mt-sm row q-px-md">
            <div class="col-6">
              <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                发货设置
              </div>
              <q-separator class="q-mx-sm" />
              <div class="q-my-md full-width">
                <q-item>
                  <q-item-section>
                    <q-item-label>配送方式</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-right">
                      <q-checkbox v-model="settingForm.ws_delivery_way" val="wuliu" label="物流配送" color="primary" />
                      <q-checkbox v-model="settingForm.ws_delivery_way" val="ziti" label="门店自提" color="primary" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator class="q-mx-sm" />

                <q-item>
                  <q-item-section>
                    <q-item-label>虚拟商品自动确认收货</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-right">
                      <q-toggle v-model="settingForm.ws_is_auto_delivery" true-value="1" false-value="0" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <q-separator class="q-ma-sm" />
              <div class="row q-col-gutter-sm">
                <div class="col-md-6 col-12">
                  <q-input outlined label="发货联系人" dense v-model="sendSet.contact_people" lazy-rules />
                </div>
                <div class="col-md-6 col-12">
                  <q-input outlined label="发货电话" dense v-model="sendSet.contact_phone" lazy-rules />
                </div>
                <div class="col-12">
                  <hl-address
                    :province="sendSet.province"
                    :city="sendSet.city"
                    :area="sendSet.district"
                    @province="sendProvince"
                    @city="sendCity"
                    @area="sendArea"
                  ></hl-address>
                </div>
                <div class="col-12">
                  <q-input label="发货详细地址" outlined v-model="sendSet.address" dense :error="false" />
                </div>
              </div>
              <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                退货原因设置
              </div>
              <div class="row">
                <q-item class="full-width" :key="`${key}-way`" v-for="(item, key) in settingForm.ws_refund_why">
                  <q-item-section>
                    <q-input outlined v-model="settingForm.ws_refund_why[key]" dense label="原因项" />
                  </q-item-section>

                  <q-item-section side>
                    <q-btn icon="las la-trash-alt" color="negative" @click="delRefundWhy(key)" round unelevated></q-btn>
                  </q-item-section>
                </q-item>
                <div class="row full-width justify-center">
                  <q-btn color="primary" label="新增原因项" @click="plusRefundWhy" unelevated />
                </div>
              </div>

              <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                退货地址设置
              </div>
              <q-separator class="q-ma-sm" />
              <div class="row q-col-gutter-sm">
                <div class="col-md-6 col-12">
                  <q-input outlined label="退货联系人" dense v-model="refundSet.contact_people" lazy-rules />
                </div>
                <div class="col-md-6 col-12">
                  <q-input outlined label="退货电话" dense v-model="refundSet.contact_phone" lazy-rules />
                </div>
                <div class="col-12">
                  <hl-address
                    :province="refundSet.province"
                    :city="refundSet.city"
                    :area="refundSet.district"
                    @province="refundProvince"
                    @city="refundCity"
                    @area="refundArea"
                  ></hl-address>
                </div>
                <div class="col-12">
                  <q-input label="退货详细地址" outlined v-model="refundSet.address" dense :error="false" />
                </div>
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
  name: 'wxmllSetting',
  components: {},
  data () {
    return {
      settingForm: {
        ws_name: '',
        ws_logo: '',
        ws_description: '',
        ws_contact_people: '',
        ws_contact_phone: '',
        ws_address: '',
        ws_evaluation_rules: '',
        ws_service_description: '',
        ws_qw_wechat_url: '',
        ws_qw_wxapp_url: '',
        ws_qw_wechat_corpId: '',
        ws_qw_wxapp_corpId: '',
        ws_hot_tags: [],
        ws_delivery_way: [],
        ws_is_auto_delivery: '',
        ws_send_set: {},
        ws_refund_set: {},
        ws_lng: '',
        ws_lat: '',
        ws_wechat_message_config: {},
        ws_comment_item: {},
        ws_refund_why: {},
        ws_pay_set: {
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
      sendSet: {},
      refundSet: {}
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
      this.$store.dispatch('wxMallSetting/getItem', null).then((res) => {
        if (parseInt(res.code) == 200) {
          if (res.data) {
            this.settingForm = res.data ? res.data : {}

            this.sendSet = res.data && res.data.ws_send_set ? res.data.ws_send_set : {}
            this.refundSet = res.data && res.data.ws_refund_set ? res.data.ws_refund_set : {}
          }
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.addSettingRef.validate().then((success) => {
        if (success) {
          this.submitDisable = true
          this.settingForm.ws_send_set = this.sendSet
          this.settingForm.ws_refund_set = this.refundSet
          const obj = {
            ...this.settingForm
          }
          this.$store
            .dispatch('wxMallSetting/setData', obj)
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
    },

    sendProvince (a) {
      this.sendSet.province = a.value
      this.sendSet.province_code = a.code
    },

    sendCity (a) {
      this.sendSet.city = a.value
      this.sendSet.city_code = a.code
    },

    sendArea (a) {
      this.sendSet.district = a.value
      this.sendSet.district_code = a.code
    },
    refundProvince (a) {
      this.refundSet.province = a.value
      this.refundSet.province_code = a.code
    },

    refundCity (a) {
      this.refundSet.city = a.value
      this.refundSet.city_code = a.code
    },

    refundArea (a) {
      this.refundSet.district = a.value
      this.refundSet.district_code = a.code
    },

    plusRefundWhy () {
      const refundWhy = this.settingForm.ws_refund_why
      refundWhy[this.randomString(5)] = ''

      this.settingForm.ws_refund_why = JSON.parse(JSON.stringify(refundWhy))
    },
    delRefundWhy (key) {
      const refundWhy = this.settingForm.ws_refund_why
      delete refundWhy[key]
      this.settingForm.ws_refund_why = JSON.parse(JSON.stringify(refundWhy))
    },

    randomString (length) {
      const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ''
      for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
      }
      return result
    }
  }
}
</script>
