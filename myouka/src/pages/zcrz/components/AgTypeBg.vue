<template>
  <div>
    <q-chip color="primary" text-color="white" v-if="params.data.zi_status == 1">未提交</q-chip>
    <q-chip color="warning" text-color="white" v-if="params.data.zi_status == 2">待审核</q-chip>
    <q-chip color="red" text-color="white" v-if="params.data.zi_status == 3">未通过</q-chip>
    <q-chip color="green" text-color="white" v-if="params.data.zi_status == 4">已通过</q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgTypeBg',
  data () {
    return {
      params: []
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
