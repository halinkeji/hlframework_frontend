<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2 q-mt-xs">
      <div style="overflow-y: scroll" class="fit full-height bg-white">
        <q-form ref="addSettingRef">
          <div class="q-mt-sm row q-px-md">
            <div class="col-7">
              <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
                <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
                消息通知设置
              </div>
              <q-separator class="q-mx-sm q-mb-sm" />
              <q-list separator>
                <q-item>
                  <q-item-section>
                    <q-item-label>通知类型</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-center">微信模板消息</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item-label header>通知会员</q-item-label>
                <q-separator />
                <q-item>
                  <q-item-section>
                    <q-item-label>订单状态更新通知</q-item-label>
                    <q-item-label caption> 通知会员购买订单状态更新 </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-input outlined v-model="settingForm.js_wechat_message_config.orderTemp" dense />
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>
                      <q-toggle v-model="settingForm.js_wechat_message_config.orderState" true-value="1" false-value="0" color="green" />
                      <q-btn round dense color="grey" flat icon="las la-question-circle">
                        <q-menu>
                          <q-card flat bordered>
                            <q-item>
                              <q-item-section>
                                <q-item-label caption>编号</q-item-label>
                                <q-item-label>OPENTM403153534</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label caption>行业</q-item-label>
                                <q-item-label>IT科技 - 互联网|电子商务</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label caption>标题</q-item-label>
                                <q-item-label>订单更新通知</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-card-section>
                              <div class="text-caption text-grey-8">消息示例</div>
                              您的订单已支付\已发货\已收货\已完成<br />
                              订单编号：GM1596997979799<br />
                              订单状态：已支付\已发货\已收货\已完成<br />
                              查看订单详情~<br />
                            </q-card-section>
                          </q-card>
                        </q-menu>
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
                <q-item-label header>通知商家</q-item-label>
                <q-separator />
                <q-item>
                  <q-item-section>
                    <q-item-label>订单状态更新通知</q-item-label>
                    <q-item-label caption> 通知管理员订单状态更新 </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-input outlined v-model="settingForm.js_wechat_message_config.storeOrderTemp" dense />
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>
                      <q-toggle v-model="settingForm.js_wechat_message_config.storeOrderState" true-value="1" false-value="0" color="green" />
                      <q-btn round dense color="grey" flat icon="las la-question-circle">
                        <q-menu>
                          <q-card flat bordered>
                            <q-item>
                              <q-item-section>
                                <q-item-label caption>编号</q-item-label>
                                <q-item-label>OPENTM403153534</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label caption>行业</q-item-label>
                                <q-item-label>IT科技 - 互联网|电子商务</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section>
                                <q-item-label caption>标题</q-item-label>
                                <q-item-label>订单更新通知</q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-card-section>
                              <div class="text-caption text-grey-8">消息示例</div>
                              商城订单已支付\已发货\已收货\已完成<br />
                              订单编号：GM1596997979799<br />
                              订单状态：已支付\已发货\已收货\已完成<br />
                              订单状态已变更，请及时处理！<br />
                            </q-card-section>
                          </q-card>
                        </q-menu>
                      </q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
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
          this.$nextTick(() => {
            this.setWechatMessage(res.data.js_wechat_message_config || {})
          })
        }
      })
    },

    setWechatMessage (messageConfig) {
      const wechatMessageConfig = {}
      for (const key in this.messageConfig) {
        const item = messageConfig && messageConfig[key]
        wechatMessageConfig[key] = item || this.messageConfig[key]
      }

      this.settingForm.js_wechat_message_config = wechatMessageConfig
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
    },
    showQqMap () {
      this.addressMap = true
      this.$nextTick(() => {
        this.$refs.qqMap.modelMap(this.settingForm.js_lat, this.settingForm.js_lng)
      })
    },
    getAddressInfo (val) {
      if (val.ad_info) {
        const ad_info = val.ad_info

        // if (ad_info.adcode) {
        //   this.settingForm.js_adcode = ad_info.adcode
        //   this.settingForm.js_province = ad_info.province
        //   this.settingForm.js_city = ad_info.city
        //   this.settingForm.js_district = ad_info.district
        //   this.settingForm.js_district_code = ad_info.adcode
        // }

        if (val.formatted_addresses && val.formatted_addresses.recommend) {
          this.settingForm.js_address = val.formatted_addresses.recommend
        }

        if (ad_info.location) {
          this.settingForm.js_lng = ad_info.location.lng.toString()
          this.settingForm.js_lat = ad_info.location.lat.toString()
        }
      }
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
