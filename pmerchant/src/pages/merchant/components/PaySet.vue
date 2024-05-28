<template>
  <q-dialog v-model="qrcodeDialog" persistent>
    <q-card
      flat
      :style="{
        width: $q.screen.width * 0.6 + 'px',
        'min-width': $q.screen.width * 0.6 + 'px',
      }"
    >
      <q-form ref="consumeSetFormRef">
        <q-item>
          <q-item-section>
            <q-item-label> 消费设置 </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" @click="closeDialog"> </q-btn>
          </q-item-section>
        </q-item>

        <q-separator />
        <q-card-section class="row q-col-gutter-sm">
          <div class="col">
            <q-card bordered flat>
              <q-card-section> 支付方式 </q-card-section>
              <q-separator />

              <q-list  >
                <q-item >
                  <q-item-section>
                    <q-item-label>微信小程序支付 </q-item-label>
                    <q-item-label caption>
                      会员可在微信小程序内在线支付购买商家服务或者商品，会员支付的费用，商家可根据T+0/1结算方式，从平台结算。
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                       <q-checkbox checked-icon="check_box" unchecked-icon="check_box_outline_blank" v-model="payConfig.payment" val="wxapp_jsapi" />

                  </q-item-section>
                </q-item>

                <q-item >
                  <q-item-section>
                    <q-item-label>付款码支付 （数字支付） </q-item-label>
                    <q-item-label caption>
                      付款码支付是指用户展示“付款码”给商户系统扫描后直接完成支付，适用于线下场所面对面收银的场景，例如商超、便利店、餐饮、医院、学校、电影院和旅游景区等具有明确经营地址的实体场所。
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                        <q-checkbox checked-icon="check_box" unchecked-icon="check_box_outline_blank" v-model="payConfig.payment" val="wechat_micropay" />

                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
          <div class="col">
            <q-card bordered flat>
              <q-card-section>
                启用平台{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}</q-card-section
              >
              <q-separator />
              <q-card-section>
                <q-option-group
                  v-model="payConfig.usePlatformBalance"
                  :options="[
                    {
                      label: '启用',
                      value: 1,
                    },
                    {
                      label: '关闭',
                      value: 0,
                    },
                  ]"
                  color="primary"
                  inline
                />
              </q-card-section>
            </q-card>
          </div>
          <div class="col">
            <q-card bordered flat>
              <q-card-section>
                启用平台{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}</q-card-section
              >
              <q-separator />
              <q-card-section>
                <q-option-group
                  v-model="payConfig.usePlatformPoints"
                  :options="[
                    {
                      label: '启用',
                      value: 1,
                    },
                    {
                      label: '关闭',
                      value: 0,
                    },
                  ]"
                  color="primary"
                  inline
                />
              </q-card-section>
            </q-card>
          </div>
          <div class="col">
            <q-card bordered flat>
              <q-card-section> 启用平台卡券</q-card-section>
              <q-separator />
              <q-card-section>
                <q-option-group
                  v-model="payConfig.usePlatformCoupon"
                  :options="[
                    {
                      label: '启用',
                      value: 1,
                    },
                    {
                      label: '关闭',
                      value: 0,
                    },
                  ]"
                  color="primary"
                  inline
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-form>
      <q-card-actions align="center">
        <q-btn @click="saveConsumeSet" color="primary" class="q-px-xl" unelevated>保存</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'RechargeMoneySet',
  data () {
    return {
      qrcodeDialog: false,
      currentLibId: 0,
      payConfig: {
        usePlatformBalance: 0,
        usePlatformPoints: 0,
        usePlatformCoupon: 0,
        payment: []
      },

      withdrawConfig: {
        withdrawCycle: 1, // 结算周期 0 T+0 1 T+1
        minWithdrawAmount: 0, // 最低提现金额
        serviceChargeRatio: 0, // 服务费或者交易分佣
        precedureFeeRatio: 0 // 手续费比例
      }
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (libId) {
      this.qrcodeDialog = true
      this.currentLibId = libId

      this.$nextTick(() => {
        this.getConsumeSet()
      })
    },
    getConsumeSet () {
      const obj = {
        relation_lib_id: this.currentLibId
      }
      this.$store
        .dispatch('merchantManage/getMerchantExtendData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (res.data && res.data.pay_config) {
              for (const x in res.data.pay_config) {
                this.payConfig[x] = res.data.pay_config[x]
              }
            }
          }
        })
        .catch((error) => {})
    },
    saveConsumeSet () {
      const obj = {
        condition: {
          relation_lib_id: this.currentLibId
        },
        formData: {
          pay_config: this.payConfig
        }
      }
      this.$store
        .dispatch('merchantManage/saveMerchantExtendData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.closeDialog()
          } else {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    },
    closeDialog () {
      this.qrcodeDialog = false
      this.$emit('closeDialog')
    }
  }
}
</script>

<style></style>
