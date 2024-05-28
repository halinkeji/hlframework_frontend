<template>
  <div>
    <q-btn v-if="parseInt(params.data.gii_settle_status) != 1 && params.data.gii_inventoryErpInCode" color="primary" unelevated @click="confirmDeleteRecord" label="结清"  > </q-btn>
    <q-btn v-else-if="parseInt(params.data.gii_settle_status) == 1 && params.data.gii_inventoryErpInCode" color="positive" unelevated  label="已结清"  > </q-btn>

  </div>
</template>

<script>
export default {
  name: 'Settle',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {

  },
  methods: {
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
