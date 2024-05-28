<template>
  <div class="row q-gutter-sm">
    <q-btn
      unelevated
      color="primary"
      label="确认调拨单"
      @click="confirmTurnDialog"
      v-if="parseInt(params.data.poi_status) == 2 && parseInt(params.data.poi_in_store_id) == parseInt(currentStoreId)"
    />
    <q-btn
      unelevated
      color="warning"
      label="等待确认"
      v-if="parseInt(params.data.poi_status) == 2 && parseInt(params.data.poi_out_store_id) == parseInt(currentStoreId)"
    />
    <q-btn unelevated color="green" label="已确认" v-if="parseInt(params.data.poi_status) == 1" />

    <q-btn
      unelevated
      color="primary"
      v-if="parseInt(params.data.poi_status) == 1 && parseInt(params.data.poi_in_store_id) == parseInt(currentStoreId)"
      label="取回"
       :disable="calculateDisabled"
      :to="{ name: 'turnBack', query: { invoiceId: params.data.invoiceId } }"
    />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'AgOperate',
  data () {
    return {
      currentStoreId: 0
    }
  },
  mounted () {},
  created () {
    const accountInfo = LocalStorage.getItem('myouka_account_info')

    if (accountInfo && accountInfo.store_id) {
      this.currentStoreId = accountInfo.store_id
    }
  },
  computed: {
    calculateDisabled () {
      const oilLendData = this.params.context.oilLendData
      const currentInvoiceCode = this.params.data.poi_invoice_code
      if (oilLendData && oilLendData.length > 0) {
        let totalCount = 0
        let lastCount = 0
        oilLendData.forEach(item => {
          if (currentInvoiceCode == item.poi_invoice_code) {
            if (item.oid_last_ton_count <= 0) {
              lastCount++
            }
            totalCount++
          }
        })

        if (lastCount >= totalCount) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    confirmTurnDialog () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '确认',
          message: `单据号${this.params.data.poi_invoice_code}，是否确认？`,
          cancel: true
        })
        .onOk(() => {
          this.confirmTurnInvoice()
        })
    },
    confirmTurnInvoice () {
      const obj = {
        poi_status: 1,
        invoiceId: this.params.data.invoiceId
      }
      this.$store
        .dispatch('turnoil/updateMainInvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '确认订单成功',
              color: 'green'
            })
            this.params.context.getLendList()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
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
  }
}
</script>

<style></style>
