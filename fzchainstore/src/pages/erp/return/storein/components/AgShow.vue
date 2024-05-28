<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addStoreReturnout', query: { id: params.data.cep_store_return_out_order_id } })" class="text-info" v-if="params.data.storeReturnOutOrderData">
      {{ params.data.storeReturnOutOrderData ? params.data.storeReturnOutOrderData.cep_contract_number : '' }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'AgShow',
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
