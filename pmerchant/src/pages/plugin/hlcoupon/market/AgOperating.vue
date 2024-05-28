<template>
  <div>
    <q-btn @click="changeCouponStatus(params.data)" v-if="parseInt(params.data.pc_market_status) == 2" color="primary" unelevated label="审核通过" />

    <q-btn @click="cancelPmerchantCheck(params.data)" v-if="parseInt(params.data.pc_market_status) == 5" color="primary" unelevated label="取消审核" />

    <q-btn @click="openPmerchantCardInfo(params.data.coupon_id)" v-if="parseInt(params.data.pc_market_status) == 3 || parseInt(params.data.pc_market_status) == 4" color="primary" unelevated label="推广记录" />
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      id: '',
      nature: ''
    }
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {
    openPmerchantCardInfo (id) {
      this.params.context.openPmerchantCardInfo(id, this.params.data)
    },

    // 批量删除
    cancelPmerchantCheck (marketItem) {
      if (marketItem && marketItem.marketId) {
        this.$q
          .dialog({
            title: '是否取消',
            message: '确定将当前卡券修改至创建中吗？',
            cancel: true
          })
          .onOk(() => {
            this.$store
              .dispatch('hlCoupon/cancelPmerchantCheck', {
                couponMarketId: marketItem.marketId
              })
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    color: 'green',
                    message: '成功',
                    caption: '操作成功',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.params.context.getCouponsList()
                }
              })
              .catch((error) => {
                this.$q.notify({
                  message: '失败',
                  caption: error.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              })
          })
      }
    },

    changeCouponStatus (marketItem) {
      this.params.context.clickCheckCouponStatus(marketItem)
    },

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
