<template>
  <div>
    <q-chip outline color="primary" text-color="white" v-if="params.data.prd_status == 1"> 未接单 </q-chip>
    <q-chip outline color="deep-orange" text-color="white" v-else-if="params.data.prd_status == 2"> 已接单 </q-chip>
    <q-chip outline color="green" text-color="white" v-else-if="params.data.prd_status == 3"> 已完成 </q-chip>
    <q-chip outline color="grey" text-color="white" v-else-if="params.data.prd_status == 4"> 已撤销 </q-chip>
  </div>
</template>
<script>
export default {
  name: 'AgStatus',
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
