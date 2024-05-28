<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height ">
      <q-form ref="invoiceDataRef" class="q-gutter-md">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          消费单据前缀
        </div>

        <div class="row">
          <q-input
            outlined
            dense
            class=" col-12 col-md-4 q-mb-sm q-px-sm"
            v-model="merchantFrom.prefix_invoice_consumeorder"
            label="自助下单单据前缀"
          />
          <q-input outlined dense class=" col-12 col-md-4 q-mb-sm q-px-sm" v-model="merchantFrom.prefix_invoice_fastFood" label="快餐单据前缀" />

          <q-input
            outlined
            dense
            class=" col-12 col-md-4 q-mb-sm q-px-sm"
            v-model="merchantFrom.prefix_invoice_quickConsume"
            label="快速消费单据前缀"
          />
          <q-input
            outlined
            dense
            class=" col-12 col-md-4 q-mb-sm q-px-sm"
            v-model="merchantFrom.prefix_invoice_rechargeMoney"
            label="会员充值单据前缀"
          />
          <q-input
            outlined
            dense
            class=" col-12 col-md-4 q-mb-sm q-px-sm"
            v-model="merchantFrom.prefix_invoice_deductMoney"
            :label="`${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit}扣费单据前缀`"
          />
          <q-input
            outlined
            dense
            class=" col-12 col-md-4 q-mb-sm q-px-sm"
            v-model="merchantFrom.prefix_invoice_addPoints"
            :label="`增加${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit}单据前缀`"
          />
          <q-input
            outlined
            dense
            class=" col-12 col-md-4 q-mb-sm q-px-sm"
            v-model="merchantFrom.prefix_invoice_deductPoint"
            :label="`${$q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit}扣除单据前缀`"
          />
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
        prefix_invoice_consumeorder: '',
        prefix_invoice_quickConsume: '',
        prefix_invoice_fastFood: '',
        prefix_invoice_rechargeMoney: '',
        prefix_invoice_deductMoney: '',
        prefix_invoice_addPoints: '',
        prefix_invoice_deductPoint: ''

      },
      disabledStatus: false
    }
  },
  components: {},
  mounted () {},

  computed: {},
  methods: {
    getPrefix () {
      this.$store
        .dispatch('invoice/getPrefixData')
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
            .dispatch('invoice/addPrefix', obj)
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
