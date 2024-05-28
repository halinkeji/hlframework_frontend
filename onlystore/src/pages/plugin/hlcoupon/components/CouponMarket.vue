<template>
  <div>
    <span v-if="params.data.marketId">
      <q-chip color="orange" text-color="white"  >{{ params.data.store && params.data.store.id ? params.data.store.name : '' }}</q-chip>

    </span>

     <span v-else>
      {{ params.data.store && params.data.store.id ? params.data.store.name : '' }}
    </span>

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
