<template>
  <div>
    <q-chip color="primary" text-color="white" v-if="parseInt(params.data.pdw_status) == 1"> 提交申请 </q-chip>
    <q-chip color="negative" text-color="white" v-if="parseInt(params.data.pdw_status) == 2"> 已拒绝 </q-chip>
    <q-chip color="positive" text-color="white" v-if="parseInt(params.data.pdw_status) == 3"> 提现成功 </q-chip>
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
