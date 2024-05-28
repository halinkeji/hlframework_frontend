<template>
  <div
    :style="{
      'max-width': params.column.actualWidth + 'px',
      width: params.column.actualWidth + 'px',
    }"
    v-if="params.data.id"
  >
    <q-select
      class="q-ma-sm q-pr-md"
      v-if="parseInt(params.data.etd_status) == 2"
      @input="getDepotStock"
      :disable="parseInt($q.localStorage.getItem('sspacechainstore_store_local').storeErpConfig.erp_erp_depotStatus) == 0 ? true : false"
      v-model="params.data.etd_in_depot_id"
      :options="depotData"
      option-value="id"
      option-label="ed_name"
      emit-value
      map-options
      dense
    >
      <template v-slot:after>
        <span class="text-dark text-subtitle2"> <span class="text-overline">库存：</span> {{ params.data.etd_in_depot_number }} </span>
      </template>
    </q-select>
    <div v-else class="text-center">
      {{ params.data && params.data.inDepot && params.data.inDepot.ed_name ? params.data.inDepot.ed_name : '' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgDepotSelect',
  data() {
    return {
      dataId: 0,
      depotData: [],
      // depotNumberInfo: {}
    }
  },
  mounted() {},
  computed: {},
  created() {
    this.dataId = this.params.data.id
    this.depotData = this.params.context.depotData
  },
  methods: {
    getDepotStock() {
      const obj = {
        depotId: this.params.data.etd_in_depot_id,
        invoiceId: this.params.data.id,
        type: 'in',
      }
      this.$store
        .dispatch('erpdepot/getDepotDetailGoodsStock', obj)
        .then((res) => {
          if (res.code == 200) {
            const row = this.params.data
            const itemsToUpdate = []
            this.params.data.etd_in_depot_number = res.data && res.data.id ? res.data.edn_number : '0.00'
            itemsToUpdate.push(row)
            this.params.api.applyTransaction({ update: itemsToUpdate })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          })
        })
    },
  },
}
</script>
