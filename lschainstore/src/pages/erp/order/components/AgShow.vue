<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
     v-if="params.data.patchGoodsOrderData"
  >
    <span @click="$router.push({ name: 'addErpOrderGoods', query: { id: params.data.patchGoodsOrderData.id } })" class="text-info" v-if="params.data.patchGoodsOrderData">
      {{ params.data.patchGoodsOrderData.cep_contract_number }}
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
