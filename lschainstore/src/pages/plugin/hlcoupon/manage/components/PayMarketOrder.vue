<template>
  <div>
    <q-dialog persistent v-model="payMarketDialogStatus">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.2) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
        }"
      >
        <q-card-section>
          <div class="text-subsitle2 text-center">支付卡券佣金</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-card flat bordered class="show-package-style">
            <q-list separator>
              <q-item>
                <q-item-section>
                  <q-item-label> 卡券名称 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    {{ couponItem.cou_title }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label> 推广服务费 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <span class="text-deep-orange text-caption"> {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>
                    <span class="text-h5 text-weight-bold text-deep-orange text-center q-px-xs"> {{ currentCouponItem.pc_service_money }}</span>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label> 推广数量 </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <span class="text-h5 text-weight-bold text-deep-orange text-center q-px-xs"> {{ currentCouponItem.pc_market_quantity }}</span>
                    <span class="text-deep-orange text-caption">张</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-card-section>

        <q-card-section class="row justify-center">
          <div class="col-12 text-center">
            <qrcode-vue :value="payCouponMarketUrl" :size="'200'" level="H" />
          </div>
          <div class="col-12 text-center text-grey text-caption">请扫码完成支付（请在{{ countDownNumber }}秒之内完成支付）</div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn label="关闭" @click="closeBuyPackageDialog" unelevated color="primary" class="q-px-xl" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      payMarketDialogStatus: false,
      currentCouponItem: {},

      payCouponMarketUrl: '',
      pmerchantOrderId: 0,
      couponItem: {},
      clockDown: null,
      countDownNumber: 60
    }
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (couponItem) {
      this.couponItem = couponItem

      this.$nextTick(() => {
        this.payCouponMarketAmountQrcode(couponItem.pmerchantMarket)
      })
    },

    payCouponMarketAmountQrcode (payMarketItem) {
      if (payMarketItem && payMarketItem.id) {
        const that = this
        const obj = {
          payMarketOrderId: payMarketItem.id
        }
        this.currentCouponItem = payMarketItem
        this.$store
          .dispatch('hlCoupon/payCouponMarketAmountQrcode', obj)
          .then((res) => {
            if (res.code == 200 && res.data.path && res.data.invoice_id) {
              this.payMarketDialogStatus = true

              this.pmerchantOrderId = res.data.invoice_id

              this.payCouponMarketUrl = res.data.path

              this.clockDown = window.setInterval(() => {
                this.countDownNumber--
                if (this.countDownNumber < 0) {
                  that.stopClockDown()
                }
              }, 1000)

              setTimeout(() => {
                that.getCouponMarketOrderStatus()
              }, 2000)
            } else {
              this.$q.notify({
                message: '操作失败',
                caption: '请联系管理员',
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            }
          })
          .catch((error) => {})
      }
    },
    getCouponMarketOrderStatus () {
      const that = this
      const obj = {
        pmerchantOrderId: this.pmerchantOrderId
      }
      this.$store
        .dispatch('hlCoupon/getCouponMarketOrderStatus', obj)
        .then((res) => {
          if (res.code == 100) {
            // 继续查询
            setTimeout(() => {
              that.getCouponMarketOrderStatus()
            }, 5000)
          } else if (res.code == 200) {
            // 订单购买成功
            this.$q.notify({
              message: '成功',
              caption: '支付成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.$nextTick(() => {
              that.closeBuyPackageDialog()
            })
          } else {
            // 订单失效
            this.$q.notify({
              message: '订单超时',
              caption: '请重新购买',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
            that.closeBuyPackageDialog()
          }
        })
        .catch((error) => {
          // 订单失效
          this.$q.notify({
            message: '订单超时',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'center'
          })
          that.closeBuyPackageDialog()
        })
    },
    closeBuyPackageDialog () {
      this.buySmsDialogStatus = false
      this.checkPackageId = 0
      this.pmerchantOrderId = 0
      this.currentCouponItem = {}
      this.payCouponMarketUrl = ''

      this.stopClockDown()

      this.$emit('closePayDialog')
    },

    stopClockDown () {
      this.countDownNumber = 60
      if (this.clockDown) {
        window.clearInterval(this.clockDown)
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
