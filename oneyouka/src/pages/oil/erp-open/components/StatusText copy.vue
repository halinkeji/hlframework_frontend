<template>
  <div
    class="text-subtitle2 text-weight-bold text-center row"
    :style="{ 'max-width': params.column.actualWidth - 10 + 'px', width: params.column.actualWidth - 10 + 'px' }"
  >
    <div class="text-positive" v-if="formatAmountThree(params.data.oid_last_ton_count) <= 0">已取</div>
    <div class="text-negative" v-if="formatAmountThree(params.data.oid_last_ton_count) > 0  && formatAmountThree(params.data.oid_last_ton_count) == formatAmountThree(params.data.oid_ton_count)">未取</div>
    <div
      v-if="
        formatAmountThree(params.data.oid_last_ton_count) > 0 &&
        formatAmountThree(params.data.oid_last_ton_count) != formatAmountThree(params.data.oid_ton_count)
      "
    >
      未取吨数 <span class="text-subtitle2 text-weight-bold text-primary"> {{ params.data.oid_last_ton_count }} </span>
    </div>
    <q-btn dense size="sm" flat round color="primary" icon="las la-eye" @click="openOilRecord()" />
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'StatusText',
  data () {
    return {
      currentStoreId: 0
    }
  },
  mounted () {},
  created () {
    const accountInfo = LocalStorage.getItem('oneyouka_account_info')

    if (accountInfo && accountInfo.store_id) {
      this.currentStoreId = accountInfo.store_id
    }
  },
  computed: {},
  methods: {
    openOilRecord () {
      this.params.context.openOilRecord(this.params.data.invoiceId)
    },
    formatAmountThree (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 1000) / 1000
      }
    }
  }
}
</script>

<style></style>
