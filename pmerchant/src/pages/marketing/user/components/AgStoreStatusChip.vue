<template>
  <div>
    <q-chip color="amber" text-color="white" v-if="parseInt(params.data.pmm_status) == -3"> 未提交申请 </q-chip>
    <q-chip color="negative" text-color="white" v-else-if="parseInt(params.data.pmm_status) == -2"> 不同意申请 </q-chip>
    <q-chip color="warning" text-color="white" v-else-if="parseInt(params.data.pmm_status) == -1"> 审核中 </q-chip>
    <q-chip color="negative" text-color="white" v-else-if="parseInt(params.data.pmm_status) == 0"> 停用 </q-chip>
    <q-chip color="primary" text-color="white" v-else-if="parseInt(params.data.pmm_status) == 1"> 运营中 </q-chip>
     <q-chip color="primary" text-color="white" v-else> 用户未申请商家 </q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgStoreStatusChip',
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
