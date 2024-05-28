<template>
  <div class="row">
    {{ couponProp[params.data.cou_couponProperty] }}

    <q-chip color="positive" size="sm" text-color="white" v-if="params.data && params.data.pmerchantMarket && parseInt(params.data.pmerchantMarket.pc_market_status) == 1">创建中</q-chip>
    <q-chip color="positive" size="sm"  text-color="white" v-if="params.data && params.data.pmerchantMarket && parseInt(params.data.pmerchantMarket.pc_market_status) == 2">待审核</q-chip>
    <q-chip color="positive" size="sm"  text-color="white" v-if="params.data && params.data.pmerchantMarket && parseInt(params.data.pmerchantMarket.pc_market_status) == 3">推广中</q-chip>
    <q-chip color="positive" size="sm"  text-color="white" v-if="params.data && params.data.pmerchantMarket && parseInt(params.data.pmerchantMarket.pc_market_status) == 4">已结束</q-chip>
    <q-chip color="positive" size="sm"  text-color="white" v-if="params.data && params.data.pmerchantMarket && parseInt(params.data.pmerchantMarket.pc_market_status) == 5">已审核等待支付</q-chip>

  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      switchStore: 2,
      couponProp: this.$store.state.hlCoupon.propertyItem
    }
  },

  mounted () {},
  created () {
    this.switchStore = this.params.data.cou_status == '1' ? 1 : 2
  },
  computed: {},
  methods: {
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
