<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >

    <span v-if="params.data.orderData" @click="$router.push({ name:  routerName[params.data.orderData.cep_type], query: { id: params.data.cep_out_id } })" class="text-info">
      {{ params.data.orderData ? params.data.orderData.cep_contract_number : '' }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AgShow',
  data () {
    return {
      dataId: 0,
      routerName: {
        12: 'addStoreReturnout',
        6: 'addErpOutGoods'
      }
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    showDetail () {
      this.params.context.showData(this.dataId)
    }
  }
}
</script>
