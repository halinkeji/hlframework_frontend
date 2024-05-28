<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
          <q-tab name="0" label="未使用"> </q-tab>
          <q-tab name="1" label="已使用"> </q-tab>
          <q-tab name="2" label="已过期"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink  full-height bg-grey-2" v-if="activeName == '0'">
        <not-use-coupon-list ref="updataNotUseCouponList"></not-use-coupon-list>
      </div>

      <div class="col-shrink  full-height bg-grey-2" v-if="activeName == '1'">
        <used-coupon-list ref="updataUsedCouponList"></used-coupon-list>
      </div>
      <div class="col-shrink  full-height bg-grey-2" v-if="activeName == '2'">
        <out-coupon-list></out-coupon-list>
      </div>
    </div>
  </q-page>
</template>
<script>

import NotUseCouponList from './components/NotUseCouponList'
import UsedCouponList from './components/UsedCouponList'
import OutCouponList from './components/OutCouponList'
export default {
  name: 'index',
  components: { NotUseCouponList, UsedCouponList, OutCouponList },
  data () {
    return {
      activeName: '0'
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    updataCouponList () {
      if (this.activeName == '0') {
        this.$refs.updataNotUseCouponList.getNotUseCouponList()
      }
      if (this.activeName == '1') {
        this.$refs.updataUsedCouponList.getUsedCouponList()
      }
    }
  }
}
</script>
