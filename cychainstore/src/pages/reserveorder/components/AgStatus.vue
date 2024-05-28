<template>
  <div>
    <q-chip
      square
      dense
      color="primary"
      text-color="white"
      v-if="parseInt(params.data.drr_status) == 1"
    >
      未接单
    </q-chip>
    <q-chip
      square
      dense
      color="deep-orange"
      text-color="white"
      v-else-if="parseInt(params.data.drr_status) == 2"
    >
      已接单
    </q-chip>
    <q-chip
      square
      dense
      color="green"
      text-color="white"
      v-else-if="parseInt(params.data.drr_status) == 3"
    >
      已完成
    </q-chip>
    <q-chip
      square
      dense
      color="red"
      text-color="white"
      v-else-if="parseInt(params.data.drr_status) == 4"
    >
      已撤销
    </q-chip>
  </div>
</template>
<script>
export default {
  name: 'AgStatus',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
