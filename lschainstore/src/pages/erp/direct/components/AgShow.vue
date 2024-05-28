<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addErpOrderGoods', query: { id: params.data.ceo_link_id } })" class="text-info" v-if="params.data.invoice">
      {{ params.data.invoice.cep_contract_number }}
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
    this.dataId = this.params.data.cep_link_id
  },
  methods: {
    showDetail () {
      this.params.context.showDetailData(this.dataId)
    }
  }
}
</script>
