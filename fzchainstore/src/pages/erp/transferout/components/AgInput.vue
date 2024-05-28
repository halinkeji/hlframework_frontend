<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addErpTransfer', query: { id: params.data.cep_transfer_order_id } })" class="text-info" v-if="params.data.transferOrderData">
      {{ params.data.transferOrderData ? params.data.transferOrderData.cep_contract_number : '' }}
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
    this.dataId = this.params.data.cet_link_id
  },
  methods: {

  }
}
</script>
