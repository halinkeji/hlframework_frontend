<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white">
      <q-scroll-area class="fit full-height">
        <q-form ref="payConfigRef">
          <div class="row">
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">买单使用卡券</span>
                  <q-toggle v-model="payConfigForm.pzc_coupon_use_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  开启后，买单结账时可以使用卡券进行优惠
                </p>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">会员{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付单笔可用百分比</span>
                  <q-toggle v-model="payConfigForm.pzc_balance_cash_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  启用后，会员扫商家收款码买单时，单笔可使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}总额的百分比。如：一码付，定额收款买单，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}，会根据如下设置的百分比自动计算出本次交易可使用的{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}金额数。<br />
                  示例：某会员张三一共有{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}100{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，商家设置的可用百分比为80，那么假设张三本次消费实付总金额300{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，则张三只能使用总{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}的（100*80%=80{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）。设置范围为1~100。
                </p>
                <q-input
                  outlined
                  bottom-slots
                  v-model="payConfigForm.pzc_balance_cash_ratio"
                  dense
                  :rules="[(val) => (val ?  /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val > 0 : true) || '请输入正确的数值']"
                  class="q-px-md"
                >
                </q-input>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">会员{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}比例</span>
                  <q-toggle v-model="payConfigForm.pzc_balance_give_point_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  启用后，会员使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}结账时，单笔可获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}比例。如：消费收银结账，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}，会根据如下设置的比例自动计算出会员本次可获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}总额。<br />
                  示例：某会员张三结账时使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}实付100{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，商家设置{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}比例为10 ，则张三本单交易可获赠总{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}1000（100×10=1000{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}）。设置范围为大于等于1。
                </p>
                <q-input outlined bottom-slots v-model="payConfigForm.pzc_balance_give_point_ratio" dense :rules="[(val) => (val ?  /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']" class="q-px-md">
                </q-input>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">会员{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付单笔可用百分比</span>
                  <q-toggle v-model="payConfigForm.pzc_point_use_cash_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  启用后，会员使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}结账时，单笔可使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}总额的百分比。如：消费收银结账，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，会根据如下设置的百分比自动计算出本次交易可使用的{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}总数。<br />
                  示例：某会员张三一共有1000{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，商家设置的可用百分比为80，则张三本单交易只能使用总{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}的（1000*80%=800{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}）。设置范围为1~100。
                </p>
                <q-input
                  outlined
                  bottom-slots
                  v-model="payConfigForm.pzc_point_use_cash_ratio"
                  dense
                  :rules="[(val) => (val ?  /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val > 0 : true) || '请输入正确的数值']"
                  class="q-px-md"
                >
                </q-input>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">会员{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付抵现换算比例</span>
                  <q-toggle v-model="payConfigForm.pzc_point_cash_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  启用后，会员使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}结账时，{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}换算货币比例。如：消费收银结账，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，会根据如下设置的比率自动计算出本次交易{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}可抵现总金额。 <br />
                  示例：某会员张三本单消费可用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}为 100{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，商家设置{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}抵现换算比例为30 ，则张三本单交易按（30{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }} = 1{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）换算可抵现总金额（100 × (1÷30)) = 3.33 {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）。 设置范围为大于等于1。
                </p>
                <q-input outlined bottom-slots v-model="payConfigForm.pzc_point_cash_ratio" dense :rules="[(val) => (val ?  /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']" class="q-px-md">
                </q-input>
              </q-card>
            </div>
          </div>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
      <q-btn unelevated v-if="authorityMeta('save')" class="q-px-xl" label="提交" @click="saveData" color="primary" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayConfig',
  data () {
    return {
      payConfigForm: {
        pzc_point_give_switch: '0',
        pzc_point_give_ratio: '',
        pzc_balance_cash_switch: '0',
        pzc_balance_cash_ratio: '',
        pzc_balance_give_point_switch: '0',
        pzc_balance_give_point_ratio: '',
        pzc_point_cash_switch: '0',
        pzc_point_cash_ratio: '',
        pzc_point_use_cash_switch: '0',
        pzc_point_use_cash_ratio: '',
        pzc_coupon_use_switch: '0'
      }
    }
  },
  created () {},
  mounted () {
    this.getConsumeSet()
  },
  computed: {},
  methods: {
    getConsumeSet () {
      this.$store
        .dispatch('zzpay/getItem')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.payConfigForm = res.data
          }
        })
        .catch((error) => {
          // console.log('error', error)
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },
    saveData () {
      this.$refs.payConfigRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.payConfigForm
          }
          this.$store
            .dispatch('zzpay/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
                  color: 'green'
                })
                this.getConsumeSet()
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
