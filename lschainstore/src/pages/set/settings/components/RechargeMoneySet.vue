<template>
  <div class="centerx labelx">
    <q-form ref="consumeSetFormRef" class="row">
      <div class="col-md-4 col-12 q-pr-md q-mt-md">
        <q-card bordered flat>
          <q-card-section>
            <span class="text-subtitle1">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付单笔可用百分比</span>
            <q-toggle
              v-model="rechargeMoneyDataForm.consume_rechargeMoney_moneyCashSwitch"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              class="float-right"
              @input="handleSwitchChange(rechargeMoneyDataForm.consume_rechargeMoney_moneyCashSwitch, 'consume_rechargeMoney_moneyCashSwitch')"
            />
          </q-card-section>
          <q-separator />
          <div class="q-ma-md">
            启用后，会员使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}结账时，单笔可使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}总额的百分比。如：会员充值结账，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}，会根据如下设置的百分比自动计算出本次交易可使用的{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}金额数。<br />
            示例：某会员张三一共有{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}100{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，商家设置的可用百分比为80，那么假设张三本次消费实付总金额300{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，则张三只能使用总{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}的（100*80%=80{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）。设置范围为1~100。
          </div>
          <q-input
            outlined
            bottom-slots
            v-model="rechargeMoneyDataForm.consume_rechargeMoney_moneyCashRatio"
            dense
            :rules="[(val) =>  (val ?  /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 1 && val <= 100 : true) || '请输入正确的数值']"
            class="q-px-md"
            @change="inputChange(rechargeMoneyDataForm.consume_rechargeMoney_moneyCashRatio, 'consume_rechargeMoney_moneyCashRatio')"
          >
          </q-input>
        </q-card>
      </div>
      <div class="col-md-4 col-12 q-pr-md q-mt-md">
        <q-card bordered flat>
          <q-card-section>
            <span class="text-subtitle1">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}比例</span>
            <q-toggle
              v-model="rechargeMoneyDataForm.consume_rechargeMoney_moneyGivePointSwitch"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              class="float-right"
              @input="handleSwitchChange(rechargeMoneyDataForm.consume_rechargeMoney_moneyGivePointSwitch, 'consume_rechargeMoney_moneyGivePointSwitch')"
            />
          </q-card-section>
          <q-separator />
          <div class="q-ma-md">
            启用后，会员使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}结账时，单笔可获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}比例。如：会员充值结账，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}，会根据如下设置的比例自动计算出会员本次可获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}总额。<br />
            示例：某会员张三结账时使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}实付100{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，商家设置{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}获赠{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}比例为10 ，则张三本单交易可获赠总{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}1000（100×10=1000{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}）。设置范围为大于等于1。
          </div>
          <q-input
            outlined
            bottom-slots
            v-model="rechargeMoneyDataForm.consume_rechargeMoney_moneyGivePointRatio"
            dense
            :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
            class="q-px-md"
            @change="inputChange(rechargeMoneyDataForm.consume_rechargeMoney_moneyGivePointRatio, 'consume_rechargeMoney_moneyGivePointRatio')"
          >
          </q-input>
        </q-card>
      </div>
      <div class="col-md-4 col-12 q-pr-md q-mt-md">
        <q-card bordered flat>
          <q-card-section>
            <span class="text-subtitle1">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付单笔可用百分比</span>
            <q-toggle
              v-model="rechargeMoneyDataForm.consume_rechargeMoney_pointCashSwitch"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              class="float-right"
              @input="handleSwitchChange(rechargeMoneyDataForm.consume_rechargeMoney_pointCashSwitch, 'consume_rechargeMoney_pointCashSwitch')"
            />
          </q-card-section>
          <q-separator />
          <div class="q-ma-md">
            启用后，会员使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}结账时，单笔可使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}总额的百分比。如：会员充值结账，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，会根据如下设置的百分比自动计算出本次交易可使用的{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}总数。<br />
            示例：某会员张三一共有1000{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，商家设置的可用百分比为80，则张三本单交易只能使用总{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}的（1000*80%=800{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}）。设置范围为1~100。
          </div>
          <q-input
            outlined
            bottom-slots
            v-model="rechargeMoneyDataForm.consume_rechargeMoney_pointCashRatio"
            dense
           :rules="[(val) =>  (val ?  /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 1 && val <= 100 : true) || '请输入正确的数值']"
            @change="inputChange(rechargeMoneyDataForm.consume_rechargeMoney_pointCashRatio, 'consume_rechargeMoney_pointCashRatio')"
            class="q-px-md"
          >
          </q-input>
        </q-card>
      </div>
      <div class="col-md-4 col-12 q-pr-md q-mt-md">
        <q-card bordered flat>
          <q-card-section>
            <span class="text-subtitle1">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付抵现换算比例</span>
            <q-toggle
              v-model="rechargeMoneyDataForm.consume_rechargeMoney_pointUseCashSwitch"
              color="green"
              :true-value="'1'"
              :false-value="'0'"
              class="float-right"
              @input="handleSwitchChange(rechargeMoneyDataForm.consume_rechargeMoney_pointUseCashSwitch, 'consume_rechargeMoney_pointUseCashSwitch')"
            />
          </q-card-section>
          <q-separator />
          <div class="q-ma-md">
            启用后，会员使用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}结账时，{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}换算货币比例。如：会员充值结账，选择{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，会根据如下设置的比率自动计算出本次交易{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}可抵现总金额。<br />
            示例：某会员张三本单消费可用{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}为 100 {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}，商家设置{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}抵现换算比例为30 ，则张三本单交易按（30{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }} = 1{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）换算可抵现总金额（100 × (1÷30)) = 3.33 {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}）。 设置范围为大于等于1。
          </div>
          <q-input
            outlined
            bottom-slots
            v-model="rechargeMoneyDataForm.consume_rechargeMoney_pointUseCashSRatio"
            dense
            :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
            class="q-px-md"
            @change="inputChange(rechargeMoneyDataForm.consume_rechargeMoney_pointUseCashSRatio, 'consume_rechargeMoney_pointUseCashSRatio')"
          >
          </q-input>
        </q-card>
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'RechargeMoneySet',
  data () {
    return {
      rechargeMoneyDataForm: {
        consume_rechargeMoney_pointSwitch: 0,
        consume_rechargeMoney_pointRatio: '',
        consume_rechargeMoney_levelSwitch: 0,
        consume_rechargeMoney_moneyCashSwitch: 0,
        consume_rechargeMoney_moneyCashRatio: '',
        consume_rechargeMoney_moneyGivePointSwitch: 0,
        consume_rechargeMoney_moneyGivePointRatio: '',
        consume_rechargeMoney_pointCashSwitch: 0,
        consume_rechargeMoney_pointCashRatio: '',
        consume_rechargeMoney_pointUseCashSwitch: 0,
        consume_rechargeMoney_pointUseCashSRatio: ''
      }
    }
  },
  mounted () {
    this.getConsumeSet()
  },
  created () {},
  computed: {},
  methods: {
    getConsumeSet () {
      const obj = {
        name: 'rechargeMoney'
      }
      this.$store
        .dispatch('settings/getConsumeSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.rechargeMoneyDataForm = res.data
          }
        })
        .catch((error) => {})
    },
    handleSwitchChange (val, keyName) {
      const obj = {}
      obj[keyName] = val
      this.$store
        .dispatch('settings/addSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '添加成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right',
              timeout: 500
            })
            this.getConsumeSet()
          }
        })
        .catch((error) => {})
    },
    inputChange (val, keyName) {
      this.$refs.consumeSetFormRef.validate().then((success) => {
        if (success) {
          const obj = {}
          obj[keyName] = val
          this.$store
            .dispatch('settings/addSet', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '添加成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right',
                  timeout: 500
                })
                this.getConsumeSet()
              }
            })
            .catch((error) => {})
        }
      })
    }
  }
}
</script>

<style></style>
