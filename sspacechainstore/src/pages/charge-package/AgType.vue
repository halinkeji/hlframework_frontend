<template>
  <div>
    <q-chip color="primary" text-color="white" dense v-if="parseInt(params.data.scp_is_member_price) == 1"> 关闭 </q-chip>
    <q-chip color="positive" text-color="white" dense v-if="parseInt(params.data.scp_is_member_price) == 2"> 启用 </q-chip>
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
