<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
   <span  @click="$router.push({ name: 'addPurchaseIn', query: { id: params.data.cep_purchase_order_id } })" class="text-info" v-if="params.data.purchaseOrderData">
      {{ params.data.purchaseOrderData.cep_contract_number }}
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
