<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height ">
      <q-form ref="invoiceDataRef" class="q-gutter-md">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          消费单据前缀
        </div>

        <div class="row">
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_rechargeMoney" label="会员充值单据前缀" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_deductMoney" :label="`${$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit}扣费单据前缀`" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_addPoints" :label="`增加${$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit}单据前缀`" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_deductPoint" :label="`${$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit}扣除单据前缀`" />
        </div>

        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          ERP单据前缀
        </div>
        <div class="row">
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_erpIn" label="采购入库单据前缀" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_erpOut" label="采购退货单据前缀" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_erpCheck" label="库存盘点单据前缀" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_erpSale" label="销货出库单据前缀" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_erpSaleReturn" label="销货退货单据前缀" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_erpRepayment" label="收款单据前缀" />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_erpPayment" label="付款单据前缀" />
        </div>
      </q-form>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
      <q-btn label="提交" color="primary" unelevated class="q-px-xl" @click="saveBut()" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'invoiceSetDetails',
  data () {
    return {
      merchantFrom: {
        prefix_invoice_consume: '',
        prefix_invoice_quickConsume: '',
        prefix_invoice_deductCount: '',
        prefix_invoice_addCount: '',
        prefix_invoice_addGroupCount: '',
        prefix_invoice_addDuration: '',
        prefix_invoice_addGroupDuration: '',
        prefix_invoice_deductDuration: '',
        prefix_invoice_rechargeMoney: '',
        prefix_invoice_deductMoney: '',
        prefix_invoice_addPoints: '',
        prefix_invoice_deductPoint: '',
        prefix_invoice_returnGoods: '',
        prefix_invoice_consumeHangUp: '',
        prefix_invoice_erpIn: '',
        prefix_invoice_erpOut: '',
        prefix_invoice_erpCheck: '',
        prefix_invoice_erpSale: '',
        prefix_invoice_erpSaleReturn: '',
        prefix_invoice_erpRepayment: '',
        prefix_invoice_erpPayment: ''
      },
      disabledStatus: false
    }
  },
  components: {},
  mounted () {
    this.getPrefix()
  },

  computed: {},
  methods: {
    getPrefix () {
      this.$store
        .dispatch('settings/getPrefixData')
        .then((res) => {
          if (res.code == 200) {
            this.merchantFrom = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    // 保存
    saveBut () {
      this.$refs.invoiceDataRef.validate().then((success) => {
        if (success) {
          this.disabledStatus = true
          const obj = {
            ...this.merchantFrom
          }
          this.$store
            .dispatch('settings/addPrefix', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '添加成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.disabledStatus = false
            })
          this.hideNowPage()
        }
      })
    },
    hideNowPage () {
      this.disabledStatus = false
    }
  }
}
</script>
