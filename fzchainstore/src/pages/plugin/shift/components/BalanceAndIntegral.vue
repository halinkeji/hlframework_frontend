<template>
  <hl-table
    :listData="balanceAndIntegralData"
    :listColumns="listColumns"
    title="储值、积分统计"
  />
</template>
<script>
export default {
  name: 'balanceAndIntegral',
  components: {},
  props: ['balanceAndIntegralData'],
  data () {
    return {
      listColumns: [
        { label: '总储值', align: 'center', field: '总储值' },
        { label: '总积分', align: 'center', field: '总积分' },
        { label: '当班充值', align: 'center', field: '当班充值' },
        { label: '积分兑换储值', align: 'center', field: '积分兑换储值' }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>
