<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2 q-mt-xs">
      <div style="overflow-y: scroll" class="fit full-height bg-white">
        <q-form ref="addSettingRef">
          <div class="q-mt-sm row q-px-md">
            <q-list class="full-width">
              <q-item>
                <q-item-section>
                  <q-item-label>订单库存扣减方式：</q-item-label>
                  <q-item-label caption> 下单扣库存:提交订单就扣库存,支付扣库存:下单后支付成功才扣库存. </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <q-radio v-model="orderSetting.deductRepertory" val="order" label="下单扣库存" />
                    <q-radio v-model="orderSetting.deductRepertory" val="pay" label="支付扣库存" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>扣除花费储值与积分时机：</q-item-label>
                  <q-item-label caption>
                    下单扣除:提交订单就扣除本笔订单花费的积分与储值,支付扣除:下单后支付成功才扣除本笔订单花费的积分与储值.
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <q-radio v-model="orderSetting.deductWealth" val="order" label="下单扣除" />
                    <q-radio v-model="orderSetting.deductWealth" val="pay" label="支付扣除" />
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>订单自动取消时长：</q-item-label>
                  <q-item-label caption> 未付款订单多久时间后自动关闭，为0或不填表示订单不自动关闭. </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <q-input outlined v-model="orderSetting.cancelOrderDuration" dense >
                      <template v-slot:append>
                        <div class="text-subtitle2">
                          分钟
                        </div>
                      </template>
                    </q-input>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>客户允许取消订单时长：</q-item-label>
                  <q-item-label caption> 已支付订单多长时间内允许客户主动取消订单，为0或不填表示不允许取消订单. </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <q-input outlined v-model="orderSetting.memberCancelOrderDuration" dense >
                      <template v-slot:append>
                        <div class="text-subtitle2">
                          分钟
                        </div>
                      </template>
                    </q-input>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>订单自动完成时长：</q-item-label>
                  <q-item-label caption> 已发货订单多久时间后自动收货完成订单，为0或不填表示订单不自动收货完成订单. </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <q-input outlined v-model="orderSetting.completeOrderDuration" dense >
                      <template v-slot:append>
                        <div class="text-subtitle2">
                          天
                        </div>
                      </template>
                    </q-input>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>订单售后退款时长：</q-item-label>
                  <q-item-label caption> 已完成订单多久时间内允许售后退款，为0或不填表示订单不限制售后退款时长. </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <q-input outlined v-model="orderSetting.afterRefundDuration" dense >
                      <template v-slot:append>
                        <div class="text-subtitle2">
                          天
                        </div>
                      </template>
                    </q-input>
                  </q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
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
      settingForm: {},
      orderSetting: {
        deductRepertory: 'order',
        deductWealth: 'order',
        cancelOrderDuration: 30,
        memberCancelOrderDuration: 0,
        completeOrderDuration: 7,
        afterRefundDuration: 7
      },
      submitDisable: false
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
          this.settingForm = res.data && res.data ? res.data : {}
          this.orderSetting = res.data && res.data.ws_order_set && res.data.ws_order_set.deductRepertory
            ? res.data.ws_order_set
            : {
                deductRepertory: 'order',
                deductWealth: 'order',
                cancelOrderDuration: 30,
                memberCancelOrderDuration: 0,
                completeOrderDuration: 7,
                afterRefundDuration: 7
              }
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.addSettingRef.validate().then((success) => {
        if (success) {
          this.submitDisable = true
          this.settingForm.ws_order_set = this.orderSetting
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
    }

  }
}
</script>
