<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
    v-if="!params.data.show_status"
  >
    <span @click="$router.push({ name: 'addErpDirect', query: { id: params.data.id }})" class="text-info">
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

  }
}
</script>
