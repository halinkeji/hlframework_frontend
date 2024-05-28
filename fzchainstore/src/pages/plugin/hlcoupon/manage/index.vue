<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xs">
        <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
          <q-tab name="1" v-if="authorityMeta('set')">
            <span>
              卡券管理
            </span>
          </q-tab>
          <q-tab name="2" v-if="authorityMeta('set')">
            <span>
              卡券回收站
            </span>
          </q-tab>
          <q-tab name="3" v-if="authorityMeta('record')">
            <span>
              卡券记录
            </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 1">
        <coupons-list :couponStatus="[1, 2]"></coupons-list>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 2">
        <disable-coupons-list :couponStatus="-1"></disable-coupons-list>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 3">
        <receive-list></receive-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import CouponsList from './components/CouponsList.vue'
import DisableCouponsList from './components/DisableCouponsList.vue'
import ReceiveList from './components/ReceiveList.vue'

export default {
  name: 'hlcoupon',
  components: { CouponsList, ReceiveList, DisableCouponsList },
  data () {
    return {
      activeName: '1'
    }
  },
  mounted () {},
  watch: {},
  created () {},
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

<style></style>
