<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      dense
      label="结账"
      class="q-px-md"
      @click="editRecord()"
    />
     <q-btn
      unelevated
      color="red"
      dense
      label="关闭"
      class="q-px-md q-ml-sm"
      @click="colsedRecord()"
    />
  </div>
</template>

<script>
export default {
  name: 'AgDebtOperator',
  data () {
    return {
      dataId: 0,
      returnParam: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.data = this.params.data
  },
  methods: {
    editRecord () {
      const data = this.data
      this.params.context.checkoutWindow(data.sc_consumeType, data.sc_handleMoneyCount, data.member_id, [], data.id)
    },
    colsedRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `订单 "${this.params.data.sc_invoiceCode}"确认关闭吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const obj = {
        id: this.params.data.id
      }
      this.$store.dispatch('debt/closeOrder', obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功关闭订单!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.params.context.debtDetailsBut()
        }
      })
    }
  }
}
</script>
