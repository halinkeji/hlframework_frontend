<template>
  <div>
    <q-chip color="primary" text-color="white" v-if="parseInt(params.data.pmw_status) == 1"> 待审核 </q-chip>
    <q-chip color="warning" text-color="white" v-if="parseInt(params.data.pmw_status) == 2"> 待打款 </q-chip>
    <q-chip color="positive" text-color="white" v-if="parseInt(params.data.pmw_status) == 3"> 已打款 </q-chip>
    <q-chip color="negative" text-color="white" v-if="parseInt(params.data.pmw_status) == 4"> 提现失败 </q-chip>
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
