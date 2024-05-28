<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">

    <div class="col-shrink q-pa-sm full-height bg-white">
      <q-scroll-area class="fit full-height">
        <q-form ref="consumeSetFormRef">

          <q-card-section class="row q-col-gutter-sm">
            <div class="col">
              <q-card bordered flat>
                <q-card-section>
                  启用平台{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}</q-card-section
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
                  启用平台{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}</q-card-section
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
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <q-btn @click="saveConsumeSet" color="primary" class="q-px-xl" unelevated>保存</q-btn>
    </div>
  </div>
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
      },
      accountInfo: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getConsumeSet()
    })
  },
  created () {
    if (this.$q.localStorage.getItem('lschainstore_account_info')) {
      this.accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')
    }
  },
  computed: {},
  methods: {

    getConsumeSet () {
      const obj = {
        relation_lib_id: this.accountInfo.lib_id
      }
      this.$store
        .dispatch('pmerchantManage/getMerchantExtendData', obj)
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
          relation_lib_id: this.accountInfo.lib_id
        },
        formData: {
          pay_config: this.payConfig,
          withdraw_config: this.withdrawConfig
        }
      }
      this.$store
        .dispatch('pmerchantManage/saveMerchantExtendData', obj)
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
