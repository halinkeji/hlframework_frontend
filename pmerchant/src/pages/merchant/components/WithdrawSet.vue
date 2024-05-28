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
            <q-item-label> 结算设置 </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round dense icon="close" @click="closeDialog"> </q-btn>
          </q-item-section>
        </q-item>

        <q-card-section class="row q-col-gutter-sm">
          <div class="col">
            <q-card bordered flat>
              <q-card-section> 结算周期设置 </q-card-section>
              <q-separator />
              <q-card-section>
                <q-option-group
                  v-model="withdrawConfig.withdrawCycle"
                  :options="[
                    {
                      label: 'T + 0',
                      value: '0',
                    },
                    {
                      label: 'T + 1',
                      value: '1',
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
              <q-card-section> 最低提现金额 </q-card-section>
              <q-separator />
              <q-card-section>
                <q-input
                  outlined
                  bottom-slots
                  v-model="withdrawConfig.minWithdrawAmount"
                  dense
                  :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
                  class="q-px-md"
                >
                </q-input>
              </q-card-section>
            </q-card>
          </div>

          <div class="col">
            <q-card bordered flat>
              <q-card-section> 交易分佣 </q-card-section>
              <q-separator />
              <q-card-section>
                <q-input
                  outlined
                  bottom-slots
                  v-model="withdrawConfig.serviceChargeRatio"
                  dense
                  :rules="[ (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',]"
                  class="q-px-md"
                >
                  <template v-slot:append>
                    <div class="text-dark text-subtilte2">%</div>
                  </template>
                </q-input>
              </q-card-section>
            </q-card>
          </div>

          <div class="col">
            <q-card bordered flat>
              <q-card-section> 手续费比例 </q-card-section>
              <q-separator />
              <q-card-section>
                <q-input
                  outlined
                  bottom-slots
                  v-model="withdrawConfig.precedureFeeRatio"
                  dense
                  :rules="[ (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',]"
                  class="q-px-md"
                >
                  <template v-slot:append>
                    <div class="text-dark text-subtilte2">%</div>
                  </template>
                </q-input>
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
        usePlatformCoupon: 0

      },

      withdrawConfig: {
        withdrawCycle: 1, // 提现周期 0 T+0 1 T+1
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

            if (res.data && res.data.withdraw_config) {
              for (const x in res.data.withdraw_config) {
                this.withdrawConfig[x] = res.data.withdraw_config[x]
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
          pay_config: this.payConfig,
          withdraw_config: this.withdrawConfig
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
