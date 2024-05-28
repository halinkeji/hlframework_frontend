<template>
  <q-page class="q-pa-sm">
    <hl-checkout
      @closeCheckoutPopup="closeCheckoutPopup"
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="openCheckoutPageIf"
    ></hl-checkout>
    <div>
      <hl-card-reading ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
    </div>
    <div class="row q-pt-md q-col-gutter-md">
      <div class="col-12 col-md-6">
        <div class="row q-col-gutter-md">
          <div class="col-md-4 col-6" v-for="(item, key) in oilGunData">

            <q-card flat class="q-pa-sm text-grey-8 cursor-pointer" :class="parseInt(item.id) == parseInt(hiddenOilGun) ? 'bg-blue text-white' : ''">
              <div class="row items-center">
                <q-item class="full-width">
                  <q-item-section class="text-bold cursor-pointer text-h5" @click="enterAmountBut(item, key)">
                    <q-item-label :class="parseInt(item.id) == parseInt(hiddenOilGun) ? 'text-white' : ''">
                      <q-icon name="las la-edit"></q-icon>
                      {{ item.og_currentMoney > 0 ? item.og_currentMoney : 0.0 }}<span class="text-caption q-ml-xs">元</span>
                      <q-tooltip content-class="bg-primary" :offset="[10, 10]"> 修改机显金额 </q-tooltip>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-avatar color="green" text-color="white" size="40px" v-if="item.og_currentStatus == 1">
                      <div class="text-caption">待支付</div>
                    </q-avatar>
                    <q-avatar color="amber" text-color="white" size="40px" v-else>
                      <div class="text-caption">空闲</div>
                    </q-avatar>
                  </q-item-section>
                </q-item>
              </div>
              <div class="q-pl-sm q-mt-sm text-center" :class="parseInt(item.id) == parseInt(hiddenOilGun) ? 'text-white' : ''" @click="selectOperateGun(item)">
                {{ item.og_name }}【{{ item.oilProduct ? item.oilProduct.op_name : '未绑定油品' }}】
                <q-tooltip content-class="bg-primary" :offset="[10, 10]"> 点我结账 </q-tooltip>
              </div>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat>
          <div class="text-subtitle1 text-primary q-pa-sm text-center text-bold">确认支付信息</div>
          <div class="bg-primary row q-py-sm q-px-lg text-white">
            <div class="col">消费信息</div>
          </div>
          <q-item class="text-balck text-subtitle1">
            <q-item-section avatar class="q-pr-none flex-center">
              <q-icon name=" brightness_1" class="text-primary" size="10px" />
            </q-item-section>
            <q-item-section>机显金额</q-item-section>
            <q-item-section class="text-right text-bold">￥ {{ handleMoneyCount }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item class="text-balck text-subtitle1">
            <q-item-section avatar class="q-pr-none flex-center">
              <q-icon name=" brightness_1" class="text-primary" size="10px" />
            </q-item-section>
            <q-item-section>油号/油枪/加油机</q-item-section>
            <q-item-section class="text-right text-bold">
              {{ newoilgun }}/{{ newOilNumber }}
              <!-- /{{ gunData.oilMachine.om_name }} -->
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item class="text-balck text-subtitle1">
            <q-item-section avatar class="q-pr-none flex-center">
              <q-icon name=" brightness_1" class="text-primary" size="10px" />
            </q-item-section>
            <q-item-section>统一售价/消费升数</q-item-section>
            <q-item-section class="text-right text-bold"> {{ weekBasePrice }}元 / {{ oilRiseNumber }} /升</q-item-section>
          </q-item>
          <q-separator />
          <q-item class="text-balck text-subtitle1">
            <q-item-section avatar class="q-pr-none flex-center">
              <q-icon name=" brightness_1" class="text-primary" size="10px" />
            </q-item-section>
            <q-item-section>
              <span v-if="consumeClass == 2 && nowPriceTpe == 1"> 专车优惠价 </span>
              <span v-else-if="consumeClass == 2 && nowPriceTpe == 2"> 专车折扣 </span>
              <span v-else-if="consumeClass == 1 && nowPriceTpe == 1"> 会员优惠价 </span>
              <span v-else-if="consumeClass == 1 && nowPriceTpe == 2"> 等级折扣 </span>

              <span v-else-if="consumeClass == 0">非会员优惠价</span></q-item-section
            >
            <q-item-section class="text-right text-bold">
              <span v-if="consumeClass == 2 && nowPriceTpe == 1"> {{ currnetSellingPrice }}元/升 </span>
              <span v-else-if="consumeClass == 2 && nowPriceTpe == 2"> {{ currnetSellingPrice }}% </span>
              <span v-else-if="consumeClass == 1 && nowPriceTpe == 1"> {{ currnetSellingPrice }}元/升 </span>
              <span v-else-if="consumeClass == 1 && nowPriceTpe == 2"> {{ currnetSellingPrice }}% </span>

              <span v-else-if="consumeClass == 0"> {{ weekBasePrice }}元/升 </span></q-item-section
            >
          </q-item>
          <div class="bg-primary q-py-sm q-px-lg text-white">订单费用</div>
          <q-item class="text-balck text-subtitle1">
            <q-item-section avatar class="q-pr-none flex-center">
              <q-icon name=" brightness_1" class="text-primary" size="10px" />
            </q-item-section>
            <q-item-section>本次应付</q-item-section>
            <q-item-section class="text-right text-bold text-red">￥{{ realMoneyCount }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item class="text-balck text-subtitle1">
            <q-item-section avatar class="q-pr-none flex-center">
              <q-icon name=" brightness_1" class="text-primary" size="10px" />
            </q-item-section>
            <q-item-section>本次优惠</q-item-section>
            <q-item-section class="text-right text-bold">￥{{ specialPrice }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item class="text-balck text-subtitle1">
            <q-item-section avatar class="q-pr-none flex-center">
              <q-icon name=" brightness_1" class="text-primary" size="10px" />
            </q-item-section>
            <q-item-section>赠送积分</q-item-section>
            <q-item-section class="text-right text-bold">{{ givePoints }}</q-item-section>
          </q-item>
          <div class="bg-primary q-py-sm text-center q-px-lg text-white">
            <q-btn
              unelevated
              rounded
              color="white"
              text-color="primary"
              class="q-px-lg"
              :disabled="!(realMoneyCount > 0 && hiddenOilGun > 0)"
              @click="checkoutWindow"
              label="确认支付"
            />
            <q-btn
              unelevated
              rounded
              color="warning"
              text-color="primary"
              class="q-px-lg q-ml-md text-white"
              v-if="debtStaus == 1"
              :disabled="!(realMoneyCount > 0 && hiddenOilGun > 0)"
              @click="confirmCreateDebt"
              label="欠账支付"
            />

            <q-btn
              unelevated
              rounded
              color="red"
              text-color="white"
              class="q-px-lg q-ml-sm"
              :disabled="!(memberId > 0 || hiddenOilGun > 0)"
              @click="emptyConsumeData"
              label="重置"
            />
          </div>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="enterAmounVisible" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="row items-center q-py-xs q-px-sm">
          <div>输入金额</div>
          <q-space />
          <q-btn icon="close" @click="cancelBut" flat round dense v-close-popup />
        </q-card-section>

        <q-form ref="numberDataRef" class="q-gutter-md" @submit="confirmBut">
          <q-card-section>
            <q-input
              v-model="og_currentMoney"
              lazy-rules
              @keyup.enter.native="confirmBut"
              class="text-h5"
              ref="currentMoneyRef"
              :rules="[(val) => /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/.test(val) || '请输入正确的售价']"
            >
              <template slot="append">
                <div class="text-body1">元</div>
              </template>
            </q-input>

            <hl-keyboard
              @changeNumber="
                (v) => {
                  og_currentMoney = v;
                }
              "
              :inputNumber="og_currentMoney"
              :decimal="true"
              @confirmEvent="confirmBut"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'oilconsume',
  data () {
    return {
      oilGunData: [],
      memberId: 0,

      gunData: {},
      zcrzPrice: [],
      givePoints: 0,
      givePointsRatio: 0,

      handleMoneyCount: 0,
      realMoneyCount: 0,

      consumeClass: 0,
      nowPriceTpe: 0, // 1 固定 2比例
      currentGunKey: -1,
      currentGunItem: {},
      og_currentMoney: '',
      enterAmounVisible: false,
      openCheckoutPageIf: false,
      debtStaus: 0,

      weekBasePrice: 0, // 基础价格
      oilRiseNumber: 0, // 本次升数
      specialPrice: 0, // 油品优惠金额
      currnetSellingPrice: 0, // 每升油价或油价折扣

      newoilgun: '请选择油枪', // 文本显示油枪
      newOilNumber: '', // 文本显示油号
      hiddenOilGun: 0, // 油枪ID
      oilProductId: '' // 油品ID
    }
  },
  mounted () {
    this.getOilGunList()
  },
  watch: {},
  created () {},
  computed: {},
  methods: {
    getOilGunList () {
      this.$store
        .dispatch('gun/getOilGun')
        .then((res) => {
          if (res.code == 200) {
            this.oilGunData = res.data ? res.data : []
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
    },
    // 金额弹窗
    enterAmountBut (item, key) {
      this.enterAmounVisible = true
      this.hiddenOilGun = item.id

      this.currentGunKey = key

      this.og_currentMoney = ''
      this.$nextTick(() => {
        this.focusInput()
      })
    },
    // 取消按钮
    cancelBut () {
      this.enterAmounVisible = false
      this.emptyConsumeData(1)
      // this.getOilGunList()
    },
    selectOperateGun (item) {
      if (this.formatAmount(item.og_currentMoney) <= 0) {
        this.$q.notify({
          message: '失败',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请先填写机显金额',
          color: 'red'
        })
        return false
      }

      const obj = {
        id: item.id,
        member_id: this.memberId
      }
      this.$store
        .dispatch('gun/getGundata', obj)
        .then((res) => {
          if (res && res.code == 200) {
            this.newoilgun = item.og_name
            this.newOilNumber = item.oilProduct && item.oilProduct.id ? item.oilProduct.op_name : ''
            this.oilProductId = item.oil_id
            this.hiddenOilGun = item.id
            this.currentGunItem = item
            this.handleMoneyCount = item.og_currentMoney
            const oilProductConfig = res.data

            this.consumeClass = oilProductConfig.consumeClass
            const nowPriceTpe = oilProductConfig.nowPriceTpe
            this.nowPriceTpe = nowPriceTpe

            const handleMoneyCount = this.formatAmount(this.handleMoneyCount)

            this.weekBasePrice = this.formatAmount(oilProductConfig.owk_price) // 需计算基数；列：机显金额 100 基数为 7.5 本次加油 13.33升  按设置的每日油价走

            this.oilRiseNumber = this.formatAmount(handleMoneyCount / this.weekBasePrice)

            if (parseInt(nowPriceTpe) == 1) {
              this.givePointsRatio = this.formatAmount(oilProductConfig.pointRebate)
              this.currnetSellingPrice = this.formatAmount(oilProductConfig.sellingPrice)
              if (this.currnetSellingPrice != this.weekBasePrice) {
                this.specialPrice = parseInt(handleMoneyCount - this.formatAmount(this.oilRiseNumber * this.currnetSellingPrice))
              } else {
                this.specialPrice = 0
              }
            } else if (parseInt(nowPriceTpe) == 2) {
              this.givePointsRatio = this.formatAmount(oilProductConfig.pointRebate * 0.01)
              this.currnetSellingPrice = this.formatAmount(oilProductConfig.sellingPrice * 0.01)
              this.specialPrice = parseInt(handleMoneyCount - this.formatAmount(handleMoneyCount * this.currnetSellingPrice))
            } else {
              this.specialPrice = 0
            }

            this.realMoneyCount = this.formatAmount(handleMoneyCount - this.specialPrice)

            this.givePoints = this.formatAmount(this.realMoneyCount * this.givePointsRatio)
          }
        })
        .catch((error) => {})
    },
    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.debtStaus = val.fieldMyouka ? val.fieldMyouka.mfm_debt_status : 0
          this.plateNumber = val.fieldMyouka ? val.fieldMyouka.mfm_plate_number : ''
          if (this.currentGunItem && this.currentGunItem.id) {
            this.selectOperateGun(this.currentGunItem)
          }
        }
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    confirmBut () {
      this.$refs.numberDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            id: this.hiddenOilGun,
            og_currentStatus: 1,
            og_currentMoney: this.og_currentMoney
          }
          this.$store
            .dispatch('gun/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.enterAmounVisible = false

                this.oilGunData[this.currentGunKey].og_currentMoney = this.og_currentMoney
                this.oilGunData[this.currentGunKey].og_currentStatus = 1

                this.og_currentMoney = ''

                this.selectOperateGun(this.oilGunData[this.currentGunKey])
              }
            })
            .catch((error) => {})
        }
      })
    },
    checkoutWindow () {
      if (this.formatAmount(this.realMoneyCount)) {
        this.openCheckoutPageIf = true
        const amountsPayable = this.realMoneyCount
        const return_param = {
          handleMoneyCount: this.handleMoneyCount,
          givePoints: this.formatAmount(this.givePoints),
          consumeClass: parseInt(this.consumeClass),
          nowPriceTpe: parseInt(this.nowPriceTpe),
          sc_consumeType: 'oilConsume',
          consumeAmount: this.realMoneyCount,
          plateNumber: this.plateNumber,
          weekBasePrice: this.weekBasePrice, // 基础价格
          oilRiseNumber: this.oilRiseNumber, // 本次升数
          specialPrice: this.specialPrice, // 油品优惠金额
          currnetSellingPrice: this.currnetSellingPrice, // 每升油价或油价折扣
          hiddenOilGun: this.hiddenOilGun, // 油枪ID
          oilProductId: this.oilProductId,
          member_id: this.memberId,
          newoilgun: this.newoilgun, // 文本显示油枪
          newOilNumber: this.newOilNumber // 文本显示油号
        }

        this.$nextTick(() => {
          this.$refs.openCheckoutCounterPage.checkoutPageReceive(
            'oilConsume',
            amountsPayable,
            parseInt(this.memberId),
            return_param,
            this.oilProductId
          )
        })
      }
    },
    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },
    paySuccessCallBack (v) {
      this.openCheckoutPageIf = false

      this.$store
        .dispatch('oilConsume/quickSetData', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '油品收银结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.getOilGunList()
            this.emptyConsumeData()
          }
        })
        .catch((error) => {})
    },
    // 清空消费数据
    emptyConsumeData (type) {
      this.debtStaus = 0
      this.givePoints = 0
      this.og_currentMoney = ''

      this.weekBasePrice = 0
      this.oilRiseNumber = 0
      this.specialPrice = 0
      this.currnetSellingPrice = 0
      this.newoilgun = '请选择油枪'
      this.newOilNumber = ''
      this.hiddenOilGun = 0
      this.oilProductId = '' // 油品ID

      this.consumeClass = 0
      this.nowPriceTpe = 0

      this.givePoints = 0
      this.givePointsRatio = 0

      this.handleMoneyCount = 0
      this.realMoneyCount = 0

      this.enterAmounVisible = false
      this.currentGunKey = -1
      this.currentGunItem = {}
      // 清空会员信息卡内容
      if (type != 1) {
        this.memberId = 0
        this.$refs.memberCardReading.emptyMemberCardInfo()
      }
    },

    confirmCreateDebt () {
      this.$q.dialog({
        title: '确认欠款？',
        message: '请核对消费信息，确认无误后点击确认按钮?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.setDebtData()
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },

    setDebtData () {
      const param = {
        handleMoneyCount: this.handleMoneyCount,
        givePoints: this.formatAmount(this.givePoints),
        consumeClass: parseInt(this.consumeClass),
        nowPriceTpe: parseInt(this.nowPriceTpe),
        sc_consumeType: 'oilConsume',
        consumeAmount: this.realMoneyCount,
        plateNumber: this.plateNumber,
        weekBasePrice: this.weekBasePrice, // 基础价格
        oilRiseNumber: this.oilRiseNumber, // 本次升数
        specialPrice: this.specialPrice, // 油品优惠金额
        currnetSellingPrice: this.currnetSellingPrice, // 每升油价或油价折扣
        hiddenOilGun: this.hiddenOilGun, // 油枪ID
        oilProductId: this.oilProductId,
        member_id: this.memberId,
        newoilgun: this.newoilgun, // 文本显示油枪
        newOilNumber: this.newOilNumber // 文本显示油号
      }
      this.$store
        .dispatch('oilConsume/setDebtCreate', param)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '油品收银结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.getOilGunList()
            this.emptyConsumeData()
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

    focusInput () {
      if (this.$refs.currentMoneyRef) {
        setTimeout(() => {
          this.$refs.currentMoneyRef.focus()
        }, 500)
      }
    }
  }
}
</script>

<style></style>
