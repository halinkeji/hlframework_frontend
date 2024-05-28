<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addStoreReturn', query: { id: params.data.id } })" class="text-info">
      {{ params.data.cep_contract_number }}
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
    this.dataId = this.params.data.id
  },
  methods: {
    showDetail () {
      this.params.context.showDetailData(this.params.data.id)
    }
  }
}
</script>
