<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addErpDirectOut', query: { id: params.data.cep_direct_out_order_id } })" class="text-info" v-if="params.data.directOrderOutData">
      {{ params.data.directOrderOutData ? params.data.directOrderOutData.cep_contract_number : '' }}
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
    this.dataId = this.params.data.cep_link_id
  },
  methods: {

  }
}
</script>
