<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <hl-card-reading ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
      </div>

      <div class="col-shrink bg-white q-pa-sm full-height  q-mt-xs">
        <q-form ref="submitFormRef" class="row fit justify-around">
          <q-card flat class="col-12 col-md-6 q-pl-md q-mt-sm ">
            <q-scroll-area class="fit full-height ">
              <div class="row">
                <div class="q-pa-sm col-12 col-md-4" v-for="(item, key) in packageData">
                  <q-card bordered flat class="q-pa-sm" >
                    <q-list dense>
                      <q-item-label header class="q-pa-xs text-h6" lines="2">{{ item.rp_name }}</q-item-label>

                      <q-item>
                        <q-item-section avatar side>
                          <q-icon color="blue" name="las la-wallet" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>{{ item.rp_give_money }}</q-item-label>
                          <q-item-label caption>赠送{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar side>
                          <q-icon color="blue" name="las la-hand-holding-usd" />
                        </q-item-section>

                        <q-item-section>
                          <q-item-label>{{ item.rp_give_points }}</q-item-label>
                          <q-item-label caption>赠送{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-btn
                        unelevated
                        rounded
                        :color="parseInt(packageData_id) == parseInt(item.id) ? 'red' : `blue`"
                        class="full-width q-mt-sm"
                        :label="parseInt(packageData_id) == parseInt(item.id) ? '取消' : `${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol}${item.rp_money}`"
                        @click="packageBut(item)"
                        :disable="!memberId"
                      />
                    </q-list>
                  </q-card>
                </div>
              </div>
            </q-scroll-area>
          </q-card>
          <q-separator inset vertical />
          <q-card flat class="col-12 col-md-5 q-pr-sm q-mt-sm ">
            <q-card-section class="text-center text-h6">
              会员充值
            </q-card-section>
            <q-card-section>
              <q-input
                outlined
                bottom-slots
                :disable="parseInt(packageData_id) > 0 ? true : false || !memberId"
                v-model="rechargeAmount"
                class="q-mt-md text-h6"
                :rules="[(val) => (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) && !!val ? false : true || '请输入正确的金额')]"
              >
                <template v-slot:prepend>
                  <span class="text-subtitle1">充值</span>
                </template>
                <template v-slot:append>
                  <div class="q-pl-none">
                    {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                  </div>
                </template>
              </q-input>
              <q-input
                outlined
                bottom-slots
                v-model="rechargeGiveMoney"
                class="q-mt-md text-h6"
                :disable="parseInt(packageData_id) > 0 ? true : false || !memberId"
                :rules="[(val) => (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) && !!val ? false : true || '请输入正确的金额')]"
              >
                <template v-slot:prepend>
                  <span class="text-subtitle1">赠送</span>
                </template>
                <template v-slot:append>
                  <div class="q-pl-none">
                    <span class="text-subtitle1">金额</span>
                  </div>
                </template>
              </q-input>
              <q-input
                outlined
                bottom-slots

                :disable="parseInt(packageData_id) > 0 ? true : false || !memberId"
                v-model="rechargeGivePoint"
                class="q-mt-md text-h6"
                :rules="[(val) => (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val) && !!val ? false : true || '请输入正确的'+this.$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit)]"
              >
                <template v-slot:prepend>
                  <span class="text-subtitle1">赠送</span>
                </template>
                <template v-slot:append>
                  <div class="q-pl-none">
                    <span class="text-subtitle1">{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }}</span>
                  </div>
                </template>
              </q-input>
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <div class="row q-my-lg">
                <div class="col-6 col-md-3 q-mt-md q-px-xs" v-for="item in fixedMoneyList">
                  <q-btn @click="rechargeAmount = item.fm_parameter" unelevated rounded color="green" :disable="memberId == 0" class="q-px-md full-width">{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ item.fm_parameter }}</q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
      </div>

      <div class="col-shrink bg-white q-pb-md q-gutter-md text-center q-mt-xs">
        <q-btn unelevated color="amber-8 " class="q-px-xl" size="lg" label="重置" @click="refreshBut" :disable="!memberId" icon="ion-refresh" />
        <q-btn unelevated color="red-5" @click="clearBut" class="q-px-xl" size="lg" :disable="!rechargeAmount" label="清除" icon="las la-trash-alt" />
        <q-btn unelevated color="blue-8" class="q-px-xl" size="lg" label="结账" :disable="(!rechargeAmount && !memberId) || disabled" @click="openCheckoutCounterPage()" icon="las la-chevron-circle-down" />
      </div>
      <hl-local-printer ref="localPrinterRef" />
      <hl-checkout @paySuccessCallBack="paySuccessCallBack" ref="openCheckoutCounterPage" @closeCheckoutPopup="closeCheckoutPopup" v-if="checkoutPageReceive"></hl-checkout>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'rechargMoney',
  components: {},
  data () {
    return {
      users: [],
      rechargeAmount: '',
      rechargeGiveMoney: '',
      rechargeGivePoint: '',
      disabled: true,
      memberId: 0,
      checkoutPageReceive: false,
      cashRegisterData: {},
      packageData_id: '',
      fixedMoneyList: [],

      packageName: '',
      columns: [
        { name: 'rp_name', label: '套餐名称', field: 'rp_name' },
        { name: 'rp_money', label: '充值金额', field: 'rp_money' },
        { name: 'rp_give_money', label: '赠送金额', field: 'rp_give_money' },
        { name: 'rp_give_points', label: '赠送' + this.$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit, field: 'rp_give_points' }
      ],
      packageData: []
    }
  },
  watch: {
    rechargeAmount (val) {
      if (val > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  },
  mounted () {
    this.getFixedmoneyList()
  },
  created () {
    this.getList()
  },
  computed: {},
  methods: {
    closeCheckoutPopup () {
      this.checkoutPageReceive = false
    },
    // 获取固定金额列表
    getFixedmoneyList () {
      const obj = {
        type: 3,
        page: 1,
        pSize: 200
      }
      this.$store
        .dispatch('fixed/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.fixedMoneyList = res.data.list
            } else {
              this.fixedMoneyList = []
            }
          }
        })
        .catch((error) => {})
    },
    getList () {
      this.$store
        .dispatch('rechargepackages/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.packageData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    // 读卡
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
        }
      }
    },
    // 选择套餐
    packageBut (data) {
      if (this.memberId > 0) {
        if (this.packageData_id != data.id) {
          this.packageData_id = data.id
          this.rechargeAmount = data.rp_money
          this.rechargeGiveMoney = data.rp_give_money
          this.rechargeGivePoint = data.rp_give_points
        } else {
          this.packageData_id = 0
          this.rechargeAmount = ''
          this.rechargeGiveMoney = ''
          this.rechargeGivePoint = ''
        }
      }
    },
    // 重置
    refreshBut () {
      this.rechargeAmount = ''
      this.rechargeGiveMoney = ''
      this.rechargeGivePoint = ''
      this.memberId = 0
      this.packageData_id = ''
      this.$refs.memberCardReading.emptyMemberCardInfo()
    },
    // 清除
    clearBut () {
      this.rechargeAmount = ''
      this.rechargeGiveMoney = ''
      this.rechargeGivePoint = ''
      this.packageData_id = ''
    },
    // 收银台返回数据
    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false

      // const obj = {
      //   ...this.cashRegisterData,
      //   rechargeGivePoint: this.rechargeGivePoint,
      //   rechargeGiveMoney: this.rechargeGiveMoney
      // };
      this.$store
        .dispatch('recharge/setData', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '充值成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.refreshBut()
          } else {
            this.$q.notify({
              message: '失败',
              caption: '操作失败',
              icon: 'ion-close-circle-outline',
              position: 'top-right',
              color: 'red'
            })
            this.disabled = false
          }
        })
        .catch((error) => {})
    },
    // 收银台
    openCheckoutCounterPage () {
      this.$refs.submitFormRef.validate().then((success) => {
        if (success) {
          const amountsPayable = this.rechargeAmount
          this.checkoutPageReceive = true

          const return_param = {
            rechargeGivePoint: this.rechargeGivePoint,
            rechargeGiveMoney: this.rechargeGiveMoney,
            packageData_id: this.packageData_id
          }

          this.$nextTick(() => {
            this.$refs.openCheckoutCounterPage.checkoutPageReceive('rechargeMoney', amountsPayable, parseInt(this.memberId), return_param)
          })
        }
      })
    }
  }
}
</script>
