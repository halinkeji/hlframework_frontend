<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <q-tabs v-model="debtTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="receipt_record" label="发票管理" />
          <q-tab name="receipt_title" label="发票抬头管理" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="debtTab == 'receipt_record'">
        <receipt-record></receipt-record>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="debtTab == 'receipt_title'">
        <receipt-title></receipt-title>
      </div>
    </div>
  </q-page>
</template>

<script>
import ReceiptTitle from './ReceiptTitle.vue'
import ReceiptRecord from './ReceiptRecord.vue'
export default {
  components: { ReceiptTitle, ReceiptRecord },
  name: 'receiptIndex',
  data () {
    return {
      debtTab: 'receipt_record'
    }
  },
  created () {},
  mounted () {},

  computed: {},
  methods: {}
}
</script>
