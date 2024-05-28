<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white">
        <q-tabs v-model="zzyxTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="coupon" label="优惠券" v-if="authorityMeta('coupon')" />
        </q-tabs>
      </div>

      <div class="col-shrink fit bg-white">
        <q-tab-panels v-model="zzyxTab" animated class="bg-grey-3 full-height fit">
          <q-tab-panel name="count" class="q-pa-none fit">
            <zzyx-count></zzyx-count>
          </q-tab-panel>
          <q-tab-panel name="timing" class="q-pa-none fit">
            <zzyx-timing></zzyx-timing>
          </q-tab-panel>
          <q-tab-panel name="coupon" class="q-pa-none fit">
            <zzyx-coupon></zzyx-coupon>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>
<script>
import zzyxCount from './Count'
import zzyxTiming from './Timing'
import zzyxCoupon from './Coupon'
export default {
  name: 'zzyxConfig',
  components: {
    zzyxCount,
    zzyxTiming,
    zzyxCoupon
  },
  data () {
    return {
      zzyxTab: 'coupon'
    }
  },
  created () {},
  mounted () {},
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
