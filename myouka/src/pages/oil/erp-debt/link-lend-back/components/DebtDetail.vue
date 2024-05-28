<template>
  <div :style="{ 'max-width': params.column.actualWidth - 10 + 'px', width: params.column.actualWidth - 10 + 'px' }">
    <div v-for="(item, key) in params.data.backDetail">
      <q-item class="full-width" v-if="key < 1">
        <q-item-section>
          <q-item-label>{{ parseInt(item.oid_debt_mode) == 1 ? '以油还油' : '现金' }}</q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label v-if="parseInt(item.oid_debt_mode) == 1"> {{ item.oid_ton_count }}吨 </q-item-label>

          <q-item-label v-else> {{ item.oid_total_price }}元 </q-item-label>
        </q-item-section>
        <q-item-section side class="q-pr-xl">
          <q-btn dense size="sm" flat round color="primary" icon="las la-eye">
            <q-menu>
              <q-table
                title="详细记录"
                :data="params.data.backDetail"
                :columns="columns"
                hide-bottom
                flat
                bordered
                separator="cell"
                :pagination="{
                  rowsPerPage: 0,
                }"
              />
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'DebtDetail',
  data () {
    return {
      currentStoreId: 0,
      columns: [
        {
          name: 'oid_debt_mode',
          label: '还油方式',
          field: 'oid_debt_mode',
          format: (val) => {
            if (parseInt(val) == 1) {
              return '以油还油'
            }
            if (parseInt(val) == 2) {
              return '现金'
            }
          },
          align: 'center'
        },
        {
          name: 'oid_ton_count',
          label: '吨数',
          field: 'oid_ton_count',
          align: 'center'
        },
        {
          name: 'oid_liter_count',
          label: '升数',
          field: 'oid_liter_count',
          align: 'center'
        },
        {
          name: 'oid_debt_price',
          label: '还油单价',
          field: 'oid_debt_price',
          align: 'center'
        },
        {
          name: 'oid_debt_profit_amount',
          label: '盈亏',
          field: 'oid_debt_profit_amount',
          align: 'center',
          format: (val) => {
            if (val < 0) {
              return '盈 ' + val
            }
            if (val > 0) {
              return '亏 ' + val
            }
          }
        }
      ]
    }
  },
  mounted () {},
  created () {
    const accountInfo = LocalStorage.getItem('myouka_account_info')
    if (accountInfo && accountInfo.store_id) {
      this.currentStoreId = accountInfo.store_id
    }
  },
  computed: {},
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
