<template>
  <div
    class="text-subtitle2 text-weight-bold text-center"
    :style="{ 'max-width': params.column.actualWidth - 10 + 'px', width: params.column.actualWidth - 10 + 'px' }"
  >
    <div v-if="parseInt(currentStoreId) == parseInt(params.data.poi_out_store_id)">
      <q-chip text-color="white" color="positive">

        <span v-if="parseInt(params.data.oid_unit) == 1">{{ params.data.oid_ton_count }}<span class="text-caption">吨</span></span>
        <span v-if="parseInt(params.data.oid_unit) == 2">{{ params.data.oid_liter_count }}<span class="text-caption">升</span></span>
      </q-chip>
    </div>
    <div v-else>
      <div v-if="parseInt(params.data.oid_unit) == 1">
        <q-chip text-color="white" color="positive" v-if="formatAmountThree(params.data.oid_last_ton_count) <= 0"> 已取 </q-chip>

        <q-chip
          color="negative"
          text-color="white"
          v-if="formatAmountThree(params.data.oid_last_ton_count) > 0"
        >
          未取 <span class="text-subtitle2 text-weight-bold "> {{ params.data.oid_last_ton_count }}<span class="text-caption">吨</span> </span>
        </q-chip>
      </div>
      <div v-if="parseInt(params.data.oid_unit) == 2">
        <q-chip text-color="white" color="positive" v-if="formatAmountThree(params.data.oid_last_liter_count) <= 0"> 已取 </q-chip>

        <q-chip
          color="negative"
          text-color="white"
          v-if="formatAmountThree(params.data.oid_last_liter_count) > 0"
        >
          未取 <span class="text-subtitle2 text-weight-bold "> {{ params.data.oid_last_liter_count }} <span class="text-caption">升</span></span>
        </q-chip>
      </div>
    </div>
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
    const accountInfo = LocalStorage.getItem('myouka_account_info')

    if (accountInfo && accountInfo.store_id) {
      this.currentStoreId = accountInfo.store_id
    }
  },
  computed: {},
  methods: {
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
