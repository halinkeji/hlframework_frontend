<template>
  <div
    :style="{
      'max-width': params.colDef.width,
      width: params.colDef.width,
    }"
  >
    <span @click="$router.push({ name: 'addErpTransferIn', query: { id: params.data.id } })" class="text-info">
      {{ params.data.cep_contract_number }}
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
