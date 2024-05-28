<template>
  <q-dialog v-model="checkoutPopupStatus" @hide="closeCheckoutPopup">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
      }"
      flat
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs ">
          <q-bar class="bg-white q-pa-md q-py-lg">
            收银结账
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">取消</q-tooltip>
            </q-btn>
          </q-bar>
        </div>

        <div class="col-shrink row full-height q-pa-sm bg-blue-grey-1">
          <div class="col-12 col-md-7 q-pa-xs">
            <q-card flat bordered class="full-width q-mb-xs" v-if="memberInfo.id">
              <q-item class="text-center">
                <q-item-section avatar>
                  <q-avatar v-if="memberInfo.avatar" :src="memberInfo.avatar" color="primary" text-color="white" />
                  <q-avatar color="grey" text-color="white" icon="person" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ memberInfo.mem_memberRealName }}</q-item-label>
                  <q-item-label>{{ memberInfo.mem_memberCardNum }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="1">积分</q-item-label>
                  <q-item-label class="text-h5">{{ memberInfo.mem_memberPointsCount }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="1">储值</q-item-label>
                  <q-item-label class="text-h5">{{ memberInfo.mem_memberMoneyCount }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption lines="1">次数</q-item-label>
                  <q-item-label class="text-h5">{{ memberInfo.mem_memberNumberCount }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
            <q-card flat bordered class="full-width" v-if="paymentMethodData.length > 0">
              <q-card-section class="text-center row">
                <div class="col-3 text-center" v-for="(v, k) in paymentMethodData">
                  <div
                    @click="selectPaymentMethod(v, k)"
                    :class="{
                      'text-danger text-primary': v.selectStatus,
                      'text-grey': !v.show_status,
                    }"
                    class="full-width full-hight"
                  >
                    <q-icon size="60px" :name="v.icon"></q-icon>

                    <q-item-label caption lines="1">{{ v.name }}({{ v.fast }})</q-item-label>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <div>
              <q-input class="q-mt-sm" dense outlined label="备注" v-model="sc_note" clearable type="textarea" :rows="2" />
            </div>
            <q-checkbox dense v-model="printInvoiceStatus" label="小票打印机" color="blue-8" />
          </div>
          <div class="col-12 col-md-5 q-pa-xs">
            <q-card flat bordered class="full-width text-h6">
              <div class="row justify-between q-my-xs">
                <div class="col-4 q-pl-md">应付金额</div>
                <div class="col-4 text-right q-pr-md">￥{{ sc_handleMoneyCount }}</div>
              </div>

              <div class="row justify-between q-my-xs" v-if="sc_rounding_amount">
                <div class="col-4 q-pl-md">抹零</div>
                <div class="col-4 text-red text-right q-pr-md">￥{{ sc_rounding_amount }}</div>
              </div>
              <div class="row justify-between q-my-xs" v-if="sc_change_amount">
                <div class="col-4 q-pl-md">现金找零</div>
                <div class="col-4 text-red text-right q-pr-md">￥{{ sc_change_amount }}</div>
              </div>

              <div class="row justify-between q-my-xs">
                <div class="col-4 q-pl-md">实付金额</div>
                <div class="col-4 text-right q-pr-md">￥{{ sc_realMoneyCount }}</div>
              </div>
            </q-card>
            <div class="q-py-sm">
              <q-input
                type="number"
                @change="
                  roundingType = 'none'
                  roundingOperate()
                "
                outlined
                dense
                v-model="sc_rounding_amount"
                label="抹零"
                @clear="clearRoundingInput"
                clearable
              >
                <template v-slot:after>
                  <q-btn
                    :unelevated="roundingType == 'yuan'"
                    :outline="roundingType != 'yuan'"
                    color="primary"
                    @click="
                      roundingType = 'yuan'
                      roundingOperate()
                    "
                    label="抹元"
                  />
                  <q-btn
                    :unelevated="roundingType == 'jiao'"
                    :outline="roundingType != 'jiao'"
                    color="primary"
                    @click="
                      roundingType = 'jiao'
                      roundingOperate()
                    "
                    label="抹角"
                  />
                  <q-btn
                    :unelevated="roundingType == 'fen'"
                    :outline="roundingType != 'fen'"
                    color="primary"
                    @click="
                      roundingType = 'fen'
                      roundingOperate()
                    "
                    label="抹分"
                  />
                </template>
              </q-input>
            </div>

            <div class="row justify-between">
              <div
                class="col-6 q-py-sm"
                v-for="(v, k, i) in nowPaymentMethod"
                :class="{
                  'q-pr-sm': k % 2 == 0 ? true : false,
                }"
              >
                <q-input dense ref="payMoneyRef" outlined v-model="v.value" @change="confirmSelectPay(nowPaymentMethod, v)" :label="v.name" :readonly="v.key == 'cashPay'" />

                <div class="text-red" v-if="v.key == 'rechargePay'">当前储值 : {{ memberInfo.mem_memberMoneyCount }} 赠送积分:{{ useMoneyGivePoint }}</div>
                <div class="text-red" v-if="v.key == 'pointPay'">
                  当前积分 : {{ memberInfo.mem_memberPointsCount }} 使用积分 :
                  {{ useDiscountPoint }}
                </div>
                <div class="q-mt-sm" v-if="v.key == 'cashPay'">
                  <div class="text-red">
                    实收现金 {{ formatAmount(sc_real_payment_cash) }}
                    <span v-if="formatAmount(formatAmount(sc_real_payment_cash) - formatAmount(v.value)) > 0">找零 {{ formatAmount(formatAmount(sc_real_payment_cash) - formatAmount(v.value)) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-shrink bg-white text-center q-py-xs">
          <q-btn unelevated @click="computeReceivePayment" :disabled="countTotalPayMoney() == sc_realMoneyCount ? false : true" color="primary" class="q-px-xl" label="结 账" />
        </div>
      </div>
    </q-card>

    <q-dialog v-model="payCodeDialogStatus">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
        flat
      >
        <q-card-section>输入付款码</q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            :autofocus="true"
            @submit="
              () => {
                return false
              }
            "
            class="q-gutter-md"
            ref="payCodeFormRef"
          >
            <div class="row">
              <div class="col-12 q-mt-sm">
                <q-input
                  ref="payCodeInputRef"
                  dense
                  square
                  @keyup.enter="scanQrCode"
                  outlined
                  v-model="nowNeedPayCode.pay_code"
                  :label="nowNeedPayCode.name"
                  :rules="[(val) => !!val || '请填写付款码']"
                >
                  <template v-slot:after>
                    <q-icon name="done_outline" color="primary" v-if="nowNeedPayCode.code_pay_status" />
                    <q-icon name="more_horiz" color="grey" v-else />
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions vertical align="center" class="q-px-md">
          <q-btn unelevated color="primary" @click="scanQrCode" class="full-width q-mx-sm">结账</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="cashPayDialog">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
        flat
      >
        <q-card-section>请输入实收现金</q-card-section>

        <q-card-section class="q-pt-none">
          <q-form
            :autofocus="true"
            @submit="
              () => {
                return false
              }
            "
            class="q-gutter-md"
            ref="payCashFormRef"
          >
            <div class="row">
              <div class="col-12 q-mt-sm">
                <q-input ref="payCashInputRef" dense square @keyup.enter="cashSettlement" outlined v-model="sc_real_payment_cash" label="实收现金" :rules="[(val) => !!val || '请填写实收现金']">
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions vertical align="center" class="q-px-md">
          <q-btn unelevated color="primary" @click="cashSettlement" class="full-width q-mx-sm">确认</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      printInvoiceStatus: true,
      checkoutPopupStatus: false,
      paymentMethodData: [],
      nowPaymentMethod: [],
      memberInfo: {},
      sc_consumeType: '',
      member_id: 0,
      sc_memberCardNum: '',
      sc_memberName: '',
      sc_getPoint: 0,
      sc_handleMoneyCount: 0,
      sc_realMoneyCount: 0,
      sc_note: '',
      sc_payStatus: 2,
      sc_pay_status: 0,
      defaultNeedPayCode: ['scanCode'],
      nowNeedPayCode: {},
      payCodeDialogStatus: false,
      return_param: {},
      buffer_id: 0,
      sc_wechatPaymentCount: 0,
      discountRule: '',
      ruleGiveIntegral: 0,
      sc_invoiceCode: '',
      roundingType: 'none',
      sc_rounding_amount: 0,
      sc_real_payment_cash: 0,
      sc_change_amount: 0,
      cashPayDialog: false
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    checkoutPageReceive (consumeType, money, member_id, return_param = {}) {
      this.sc_consumeType = consumeType
      this.return_param = return_param
      this.member_id = member_id
      this.sc_handleMoneyCount = money
      this.sc_realMoneyCount = money
      this.checkoutPopupStatus = true

      this.$nextTick(() => {
        this.getChectoutSettle(consumeType, member_id)
      })
    },

    getChectoutSettle (consumeType = null, member_id = null) {
      const obj = {
        member_id: member_id,
        consumeType: consumeType
      }
      this.$store
        .dispatch('components/checkoutPlugin', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.memberInfo) {
              this.memberInfo = res.data.memberInfo
            }

            if (res.data.payment) {
              this.paymentMethodModel(res.data.payment)
            }
          }
        })
        .catch((error) => {})
    },

    paymentMethodModel (payment = null) {
      const that = this

      _(payment).forEach(function (v) {
        v.show_status = true
      })

      that.$nextTick(() => {
        that.paymentMethodData = payment
      })
    },

    selectPaymentMethod (v, k) {
      if (!v.show_status) {
        return false
      }
      v.selectStatus = !v.selectStatus

      const nowPaymentMethod = this.nowPaymentMethod

      if (!v.selectStatus) {
        this.cancelSelectPay(nowPaymentMethod, v.key)
      } else {
        this.confirmSelectPay(nowPaymentMethod, v, 'add')
      }
    },

    confirmSelectPay (nowPaymentMethod = null, v = null, changeModel = 'change') {
      v.value = this.formatAmount(v.value)
      const that = this
      const handleMoneyCount = this.sc_handleMoneyCount
      const countTotalPayMoney = this.countTotalPayMoney()

      let nowPayMoney = this.formatAmount(handleMoneyCount - countTotalPayMoney)
      if (changeModel == 'change') {
        nowPayMoney = this.formatAmount(this.formatAmount(nowPayMoney) + this.formatAmount(v.value))
      }
      if (changeModel == 'add') {
        v.value = nowPayMoney
      }

      if (countTotalPayMoney > handleMoneyCount) {
        this.$q.notify({
          message: '失败',
          caption: '汇总金额大于应付金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        v.value = 0
        return false
      }

      if (changeModel == 'add') {
        if (v.key == 'cashPay') {
          this.cashPayDialog = true
          this.sc_real_payment_cash = 0
          this.sc_change_amount = 0

          this.$nextTick(() => {
            this.focusCashPayInput()
          })

          return false
        }
        nowPaymentMethod.push({
          value: v.value,
          name: v.name,
          key: v.key
        })
        this.$nextTick(() => {
          this.nowPaymentMethod = nowPaymentMethod
          if (this.nowPaymentMethod) {
            const ref_index = this.nowPaymentMethod.length
            setTimeout(() => {
              if (ref_index > 0) {
                this.$refs.payMoneyRef[ref_index - 1].focus()
              }
            }, 200)
          }
        })
      }
    },

    cancelSelectPay (nowPaymentMethod = null, key = null) {
      const that = this
      const payment_index = _.findIndex(nowPaymentMethod, function (o) {
        return o.key == key
      })

      switch (key) {
        case 'rechargePay':
          that.useMoneyGivePoint = 0

          break
        case 'pointPay':
          that.useDiscountPoint = 0
          break
        default:
        // 默认代码块;
      }

      nowPaymentMethod.splice(payment_index, 1)
      this.nowPaymentMethod = nowPaymentMethod
    },

    countTotalPayMoney () {
      const that = this
      const obj = this.nowPaymentMethod
      let totalMoney = 0
      const sc_rulePaymentCount = this.formatAmount(this.sc_rulePaymentCount)
      const sc_couponPaymentCount = this.formatAmount(this.sc_couponPaymentCount)
      _(obj).forEach(function (v) {
        totalMoney += that.formatAmount(v.value)
      })

      return this.formatAmount(totalMoney + sc_rulePaymentCount + sc_couponPaymentCount)
    },

    closeCheckoutPopup () {
      this.$nextTick(() => {
        this.checkoutPopupStatus = false
      })
      this.$emit('closeCheckoutPopup')
    },

    computeReceivePayment () {
      const that = this
      this.buffer_id = 0
      const return_param = {
        ...this._data
      }

      this.$store
        .dispatch('components/buffer', return_param)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.buffer_id = res.data.id

            const nowPaymentMethod = this.nowPaymentMethod

            let nowPayCodeData = null
            nowPaymentMethod.forEach(function (v, k, i) {
              if (that.defaultNeedPayCode.indexOf(v.key) >= 0) {
                v.pay_code = ''
                v.code_pay_status = false
                nowPayCodeData = v
              }
            })

            if (nowPayCodeData) {
              this.nowNeedPayCode = JSON.parse(JSON.stringify(nowPayCodeData))
              this.payCodeDialogStatus = true
            } else {
              that.paySuccessCallBack(1)
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: '结账失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    focusPayCodeInput () {
      const payCodeInputRef = this.$refs.payCodeInputRef
      if (payCodeInputRef[0]) {
        payCodeInputRef[0].focus()
      }
    },
    focusCashPayInput () {
      const payCashInputRef = this.$refs.payCashInputRef
      setTimeout(() => {
        if (payCashInputRef) {
          payCashInputRef.focus()
        }
      }, 500)
    },

    scanQrCode () {
      const that = this
      this.focusPayCodeInput()
      this.$refs.payCodeFormRef.validate().then((success) => {
        if (success) {
          const nowNeedPayCode = this.nowNeedPayCode

          that.callScanCodePay(nowNeedPayCode)
        }
      })
    },

    callScanCodePay (item) {
      const obj = {
        payKey: item.key,
        auth_code: item.pay_code,
        total_fee: item.value,
        sc_consumeType: this.sc_consumeType,
        buffer_id: this.buffer_id
      }
      this.$q.loading.show({
        message: item.name + '正在结算'
      })
      this.$store
        .dispatch('components/scan', obj)
        .then((res) => {
          if (res.code == 200) {
            setTimeout(() => {
              this.sc_invoiceCode = res.data.order_no
              this.nowNeedPayCode.payKey = res.data.payKey
              this.verificationPayMentOrder(res.data.order_no, item, res.data.payKey)
            }, 3000)
          } else {
            this.$q.loading.hide()
            this.$q.notify({
              message: '失败',
              caption: '发起' + item.name + '失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    verificationPayMentOrder (order_no, item, payKey) {
      const that = this
      const obj = {
        payKey: payKey,
        order_no: order_no
      }
      this.$store
        .dispatch('components/verify', obj)
        .then((res) => {
          if (res.code == 200) {
            const nowPaymentMethod = this.nowPaymentMethod

            const pay_index = _.findIndex(nowPaymentMethod, function (o) {
              return o.key == item.key
            })

            this.$nextTick(() => {
              this.nowPaymentMethod[pay_index].code_pay_status = true
              this.nowPaymentMethod[pay_index].key = item.payKey
              this.nowNeedPayCode.code_pay_status = true

              this.nowNeedPayCode.key = item.payKey

              this.$q.loading.hide()
              const oneCode = this.nowNeedPayCode.pay_code ? this.nowNeedPayCode.pay_code.substring(0, 1) : 1
              this.sc_wechatPaymentCount = oneCode == 1 ? item.value : 0
              const type = parseInt(oneCode) == 1 ? 1 : 2

              this.paySuccessCallBack(type)
            })
          } else if (res.code == 100) {
            setTimeout(() => {
              this.verificationPayMentOrder(order_no, item, payKey)
            }, 3000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: '验证' + item.name + '订单失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1500,
              position: 'top-right'
            })
            this.$q.loading.hide()
          }
        })
        .catch((error) => {})
    },

    // 去结算
    paySuccessCallBack (type) {
      const handleMoneyCount = this.sc_handleMoneyCount
      const countTotalPayMoney = this.countTotalPayMoney()
      if (countTotalPayMoney > handleMoneyCount) {
        this.$q.notify({
          message: '失败',
          caption: '汇总金额大于应付金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      if (parseInt(this.buffer_id) <= 0) {
        this.$q.notify({
          message: '失败',
          caption: '结账失败',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })

        return false
      }

      this.$nextTick(() => {
        this.checkoutPopupStatus = false
      })
      const sc_wechatPaymentCount = this.sc_wechatPaymentCount
      this.nowNeedPayCode.code_pay_status = true

      setTimeout(() => {
        this.$emit('paySuccessCallBack', {
          buffer_id: this.buffer_id,
          type,
          sc_wechatPaymentCount,
          nowNeedPayCode: this.nowNeedPayCode,
          sc_invoiceCode: this.sc_invoiceCode
        })
      }, 200)
    },

    inputDiscountRule () {
      const discountRule = this.discountRule
      if (discountRule) {
        if (this.formatAmount(discountRule.ic_discount_ratio) && this.formatAmount(discountRule.ic_discount_ratio) < 100) {
          this.sc_rulePaymentCount = this.formatAmount(this.sc_handleMoneyCount - this.formatAmount(this.sc_handleMoneyCount * (discountRule.ic_discount_ratio * 0.01)))
          // this.sc_realMoneyCount = this.formatAmount(this.sc_handleMoneyCount - this.sc_rulePaymentCount)
        }

        if (discountRule.ic_integral_ratio) {
          this.ruleGiveIntegral = this.formatAmount(
            this.formatAmount(discountRule.ic_discount_ratio * 0.01) * this.formatAmount(discountRule.ic_integral_ratio * 0.01) * this.formatAmount(this.sc_handleMoneyCount)
          )
        }
      } else {
        // this.sc_realMoneyCount = this.sc_handleMoneyCount
        this.ruleGiveIntegral = 0
        this.sc_rulePaymentCount = 0
      }
      this.clearRoundingInput()
      this.computeRealMoneyCount()
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    // 格式化保留小数点后一位数据
    formatOneAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    // 计算实付金额
    computeRealMoneyCount () {
      const handleMoneyCount = this.formatAmount(this.sc_handleMoneyCount)
      const rulePaymentCount = this.formatAmount(this.sc_rulePaymentCount) // 规则优惠
      const couponPaymentCount = this.formatAmount(this.sc_couponPaymentCount) // 卡券优惠
      const roundingAmount = this.formatAmount(this.sc_rounding_amount) // 抹零
      this.sc_realMoneyCount = this.formatAmount(handleMoneyCount - rulePaymentCount - couponPaymentCount - roundingAmount)
    },

    // 抹零操作
    roundingOperate () {
      const handleMoneyCount = this.sc_handleMoneyCount
      let money = 0
      let unit = 0
      let fen = 0
      if (parseInt(handleMoneyCount) == handleMoneyCount) {
        money = this.formatAmount(handleMoneyCount)
          .toString()
          .split('')
        unit = money[money.length - 1]
        fen = 0
      } else {
        const moneyCount = handleMoneyCount.toString()
        money = moneyCount.split('.')[0]
        unit = moneyCount.split('')[money.length - 1]
        fen = moneyCount.split('')[moneyCount.length - 1]
      }

      switch (this.roundingType) {
        case 'yuan':
          this.sc_rounding_amount = this.formatAmount(this.formatAmount(unit) + this.formatAmount(handleMoneyCount - parseInt(handleMoneyCount)))
          break
        case 'jiao':
          this.sc_rounding_amount = this.formatAmount(handleMoneyCount - parseInt(handleMoneyCount))
          break
        case 'fen':
          this.sc_rounding_amount = this.formatOneAmount(fen / 100)
          break
      }

      if (this.formatAmount(this.sc_rounding_amount) > this.formatAmount(this.sc_handleMoneyCount)) {
        this.sc_rounding_amount = 0
        this.$q.notify({
          message: '错误',
          caption: '已超过结算金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
      this.nowPaymentMethod = []
      this.sc_change_amount = 0
      this.resetPaymentMethodData()
      this.computeRealMoneyCount()
    },
    // 现金收银弹窗
    cashSettlement () {
      const nowPaymentMethod = this.nowPaymentMethod
      this.$refs.payCashFormRef.validate().then((success) => {
        if (success) {
          let nowPayMoney = this.formatAmount(this.sc_realMoneyCount - this.countTotalPayMoney())

          nowPayMoney = nowPayMoney >= this.sc_real_payment_cash ? this.sc_real_payment_cash : nowPayMoney

          nowPaymentMethod.push({
            value: nowPayMoney,
            name: '现金支付',
            key: 'cashPay'
          })
          this.$nextTick(() => {
            this.cashPayDialog = false
            this.nowPaymentMethod = nowPaymentMethod
            if (this.nowPaymentMethod) {
              this.sc_change_amount = this.formatAmount(this.sc_real_payment_cash - nowPayMoney)
              const ref_index = this.nowPaymentMethod.length
              setTimeout(() => {
                if (ref_index > 0) {
                  this.$refs.payMoneyRef[ref_index - 1].focus()
                }
              }, 200)
            }
          })
        }
      })
    },
    // 清除抹零文本框
    clearRoundingInput () {
      this.roundingType = 'none'
      // this.sc_rounding_amount = 0
      this.roundingOperate()
      this.resetPaymentMethodData()
    },
    // 充值支付方式
    resetPaymentMethodData () {
      const that = this
      const paymentMethodData = that.paymentMethodData
      _(paymentMethodData).forEach(function (v) {
        v.selectStatus = false
      })

      that.$nextTick(() => {
        that.paymentMethodData = paymentMethodData
      })
    }
  }
}
</script>
