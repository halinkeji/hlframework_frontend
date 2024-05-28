<template>
  <div>
    <q-chip color="primary" text-color="white" dense v-if="parseInt(params.data.qcr_type) == 1"> 按小时计费 </q-chip>
    <q-chip color="positive" text-color="white" dense v-if="parseInt(params.data.qcr_type) == 2"> 按包段计费 </q-chip>
    <q-chip color="deep-orange" text-color="white" dense v-if="parseInt(params.data.qcr_type) == 3"> 按包场计费 </q-chip>
    <q-chip color="teal" text-color="white" dense v-if="parseInt(params.data.qcr_type) == 4"> 分时段计费 </q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgType',
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
