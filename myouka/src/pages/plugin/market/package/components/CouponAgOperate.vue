<template>
  <div>
    <q-btn unelevated color="primary" class="q-mr-sm" label="添加" @click="pushCoupon" />
  </div>
</template>
<script>
export default {
  name: 'CouponAgOperate',
  components: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    pushCoupon () {
      this.$q.notify({
        message: '添加优惠券成功',
        color: 'green',
        icon: 'ion-checkmark-circle-outline',
        timeout: 500,
        position: 'top-right'
      })
      this.params.context.selectedCouponData = this.params.data
      this.params.context.showDialog = false
    }
  }
}
</script>
