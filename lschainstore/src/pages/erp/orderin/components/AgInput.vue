<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addErpOutGoods', query: { id: params.data.cep_out_depot_order_id } })" class="text-info" v-if="params.data.outDepotOrderData">
      {{ params.data.outDepotOrderData ? params.data.outDepotOrderData.cep_contract_number : '' }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AgInput',
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

  }
}
</script>
