<template>
  <div>

    <q-chip color="primary" text-color="white" v-if="parseInt(params.data.pmrstatus) == 1"> 在途中 </q-chip>
    <q-chip color="warning" text-color="white" v-if="parseInt(params.data.pmrstatus) == 2"> 已获得 </q-chip>
    <q-chip color="positive" text-color="white" v-if="parseInt(params.data.pmrstatus) == 3"> 已提现 </q-chip>
    <q-chip color="negative" text-color="white" v-if="parseInt(params.data.pmrstatus) == 4"> 已失效 </q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgStatusChip',
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>

<style scoped></style>
