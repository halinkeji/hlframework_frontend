<template>
  <div>
    <q-chip color="grey-6" text-color="white"  v-if="parseInt(params.data.cmd_status) == 3">已使用</q-chip>
    <q-chip color="green" text-color="white" v-if="parseInt(params.data.cmd_status) == 2">未使用</q-chip>
  </div>
</template>

<script>
export default {
  name: 'AgStatusChip',
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
