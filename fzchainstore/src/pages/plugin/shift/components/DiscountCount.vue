<template>
  <hl-table :listData="discountData" :listColumns="listColumns" title="优惠" />
</template>
<script>
export default {
  name: 'discountCount',
  components: {},
  props: ['discountData'],
  data () {
    return {
      listColumns: [
        { label: '优惠券', align: 'center', field: 'sc_couponPaymentCount' },
        { label: '规则优惠', align: 'center', field: 'sc_rulePaymentCount' },
        { label: '等级优惠', align: 'center', field: 'sc_levelPaymentCount' },
        {
          label: '积分兑换优惠',
          align: 'center',
          field: 'sc_pointPaymentCount'
        },
        { label: '其他优惠', align: 'center', field: 'sc_otherPaymentCount' }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>
