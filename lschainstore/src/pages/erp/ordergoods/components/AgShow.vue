<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addOrderGoods', query: { id: params.data.cep_patch_order_id } })" class="text-info" v-if="params.data.patchOrderData">
      {{ params.data.patchOrderData.cep_contract_number }}
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
