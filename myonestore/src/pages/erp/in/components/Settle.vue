<template>
  <div>
     <hl-local-printer ref="localPrinterRef" :landscape="true" :dpi="'horizontal'" :margin="'10px 0'" />
    <q-btn
      v-if="parseInt(params.data.gii_settle_status) != 1 && params.data.gii_inventoryErpInCode"
      color="primary"
      unelevated
      @click="confirmDeleteRecord"
      label="结清"
    >
    </q-btn>
    <q-btn v-else-if="parseInt(params.data.gii_settle_status) == 1 && params.data.gii_inventoryErpInCode" color="positive" unelevated label="已结清">
    </q-btn>
    <q-btn
      color="warning"
      size="sm"
      round
      icon="las la-print"
      class="q-ml-sm"
      unelevated
      v-if="params.data.bid > 0 && processMode === 'electron'"
      @click="printInvoice"
    >
      <q-tooltip> 打印 {{ params.data.bid }} </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'Settle',
  data () {
    return {
      dataId: 0,
      processMode: process.env.MODE
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    printInvoice () {
      this.$store
        .dispatch('cloudprinter/printErp', {
          invoiceId: this.params.data.bid,
          erpType: 'outGoods'
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data) {
              this.$refs.localPrinterRef.startPrinter(res.data)
            }
            return false
          }
        })
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定结算退货订单号为  "${this.params.data.gii_inventoryInCode}的订单吗？"`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const obj = [this.params.data.bid]
      this.$store
        .dispatch('erpin/settleInvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结算订单成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
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
    }
  }
}
</script>
