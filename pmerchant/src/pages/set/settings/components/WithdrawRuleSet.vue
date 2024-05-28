<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height">
      <q-scroll-area class="fit full-height">
        <q-form ref="modelConfigRef" class="q-gutter-md row">
          <q-card flat class="bg-white q-pa-md col-8">
            <q-list separator bordered padding>
              <q-item>
                <q-item-section>
                  <q-item-label>T + 0 设置</q-item-label>
                  <q-item-label caption>消费后的当天即可进行结算，非交易日也可以进行结算（交易日为：周一至周五）。</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.minWithdrawAmountZero"
                    dense
                    :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
                    label="最低提现金额"
                  >
                  </q-input>
                </q-item-section>

                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.serviceChargeRatioZero"
                    dense
                    :rules="[
                      (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',
                    ]"
                    label="交易分佣"
                    hint="设置区间为 0.01 至 100"
                  >
                    <template v-slot:append>
                      <div class="text-dark text-subtilte2">%</div>
                    </template>
                  </q-input>
                </q-item-section>

                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.precedureFeeRatioZero"
                    dense
                    :rules="[
                      (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',
                    ]"
                    label="手续费比例"
                  >
                    <template v-slot:append>
                      <div class="text-dark text-subtilte2">%</div>
                    </template>
                  </q-input>
                </q-item-section>

                <q-item-section side>
                  <q-toggle v-model="configData.zeroStatus" color="green" :true-value="1" :false-value="0" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>T + 1 设置</q-item-label>
                  <q-item-label caption> 消费后的第二天可进行结算，必须在交易日才可以进行结算（交易日为：周一至周五）。</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.minWithdrawAmountOne"
                    dense
                    :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
                    label="最低提现金额"
                  >
                  </q-input>
                </q-item-section>

                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.serviceChargeRatioOne"
                    dense
                    :rules="[
                      (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',
                    ]"
                    label="交易分佣"
                    hint="设置区间为 0.01 至 100"
                  >
                    <template v-slot:append>
                      <div class="text-dark text-subtilte2">%</div>
                    </template>
                  </q-input>
                </q-item-section>

                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.precedureFeeRatioOne"
                    dense
                    :rules="[
                      (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',
                    ]"
                    label="手续费比例"
                  >
                    <template v-slot:append>
                      <div class="text-dark text-subtilte2">%</div>
                    </template>
                  </q-input>
                </q-item-section>

                <q-item-section side>
                  <q-toggle v-model="configData.oneStatus" color="green" :true-value="1" :false-value="0" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <q-btn class="q-px-xl" unelevated label="保存" @click="saveData" color="primary" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'WithdrawRuleSet',
  data () {
    return {
      configData: {
        minWithdrawAmountZero: 0,
        serviceChargeRatioZero: 0,
        precedureFeeRatioZero: 0,
        minWithdrawAmountOne: 0,
        serviceChargeRatioOne: 0,
        precedureFeeRatioOne: 0,
        oneStatus: 0,
        zeroStatus: 0
      },
      paramsKey: 'pmerchant_withdraw_config'
    }
  },
  components: {},
  mounted () {
    this.getItem()
  },

  computed: {},
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('settings/getSuperModel', { key: this.paramsKey }).then((res) => {
        if (res.code == 200) {
          this.setConfigContent(res.data)
        }
      })
    },
    setConfigContent (data) {
      for (const key in this.configData) {
        this.configData[key] = data[key] ? data[key] : ''
      }
    },
    // 提交
    saveData () {
      this.$refs.modelConfigRef.validate().then((success) => {
        if (success) {
          const obj = {
            value: this.configData,
            key: this.paramsKey
          }
          this.$store
            .dispatch('settings/setSuperModel', obj)
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
        }
      })
    }
  }
}
</script>
