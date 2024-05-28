<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-py-sm text-subtitle2 row">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator  v-if="showName != '报表'">
          <q-tab name="oilRefuel" :label="'加油' + showName" />
          <q-tab name="consume" :label="'商品销售' + showName" />
          <q-tab name="oil" :label="'油品' + showName" />
          <q-tab name="coupon" :label="'优惠券' + showName" />
          <q-tab name="debt" :label="'欠账' + showName" />
          <q-tab name="kzls" :label="'开支流水' + showName" />
          <q-tab name="user" :label="'员工绩效' + showName" />
          <q-tab name="integral" :label="'积分' + showName" />
          <q-tab name="balance" :label="'储值' + showName" />
        </q-tabs>
        <q-space />
        <q-btn-toggle
          v-model="showName"
          toggle-color="primary"
          unelevated
          class="my-custom-toggle"
          :options="[
            { label: '明细', value: '明细' },
            { label: '统计', value: '统计' },
            { label: '报表', value: '报表' },
          ]"
        />
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'oilRefuel' && showName != '报表'">
        <refue-count v-if="showName == '统计'"></refue-count>
        <refuel-detail v-if="showName == '明细'" ref="oilRefuelnRef"></refuel-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'consume' && showName != '报表'">
        <consum-count v-if="showName == '统计'"></consum-count>
        <consum-detail v-if="showName == '明细'" ref="consumeRef"></consum-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'coupon' && showName != '报表'">
        <coupon-count v-if="showName == '统计'"></coupon-count>
        <coupon-detail v-if="showName == '明细'" ref="couponRef"></coupon-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'oil' && showName != '报表'">
        <oil-count v-if="showName == '统计'"></oil-count>
        <oil-detail v-if="showName == '明细'" ref="oilRef"></oil-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'debt' && showName != '报表'">
        <debt-count v-if="showName == '统计'"></debt-count>
        <debt-detail v-if="showName == '明细'" ref="debtRef"></debt-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'kzls' && showName != '报表'">
        <kzls-count v-if="showName == '统计'"></kzls-count>
        <kzls-detail v-if="showName == '明细'" ref="kzlsRef"></kzls-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'user' && showName != '报表'">
        <staff-count v-if="showName == '统计'"></staff-count>
        <staff-detail v-if="showName == '明细'" ref="userRef"></staff-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'integral' && showName != '报表'">
        <integral-count v-if="showName == '统计'"></integral-count>
        <integral-detail v-if="showName == '明细'" ref="integralRef"></integral-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="tab == 'balance' && showName != '报表'">
        <balance-count v-if="showName == '统计'"></balance-count>
        <balance-detail v-if="showName == '明细'" ref="balanceRef"></balance-detail>
      </div>

      <div class="col-shrink full-height bg-white" v-if="showName == '报表'">
        <report-page :showType="1" />
      </div>
    </div>
  </q-page>
</template>
<script>
import BalanceCount from './components/BalanceCount.vue'
import BalanceDetail from './components/BalanceDetail.vue'
import ConsumCount from './components/ConsumCount.vue'
import ConsumDetail from './components/ConsumDetail.vue'
import CouponCount from './components/CouponCount.vue'
import CouponDetail from './components/CouponDetail.vue'
import IntegralCount from './components/IntegralCount.vue'
import IntegralDetail from './components/IntegralDetail.vue'
import KzlsCount from './components/KzlsCount.vue'
import KzlsDetail from './components/KzlsDetail.vue'
import RefueCount from './components/RefueCount.vue'
import RefuelDetail from './components/RefuelDetail.vue'
import StaffCount from './components/StaffCount.vue'
import StaffDetail from './components/StaffDetail.vue'
import OilCount from './components/OilCount.vue'
import OilDetail from './components/OilDetail.vue'
import DebtCount from './components/DebtCount.vue'
import DebtDetail from './components/DebtDetail.vue'
import reportPage from '../Report.vue'
export default {
  name: 'printerIndex',
  components: {
    RefueCount,
    RefuelDetail,
    ConsumCount,
    ConsumDetail,
    CouponCount,
    CouponDetail,
    IntegralDetail,
    IntegralCount,
    BalanceCount,
    BalanceDetail,
    KzlsCount,
    KzlsDetail,
    reportPage,
    StaffCount,
    StaffDetail,
    OilCount,
    OilDetail,
    DebtDetail,
    DebtCount
  },
  data () {
    return { showName: '明细', tab: 'oilRefuel' }
  },
  watch: {

  },
  mounted () {

  },
  computed: {},
  created () {},
  methods: {
    searchBut () {
      switch (this.tab) {
        case 'oilRefuel':
          setTimeout(() => {
            this.$nextTick(() => {
              // this.$refs.oilRefuelnRef.getSummaryList()
            })
          }, 100)
          break
        case 'consume':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.consumeRef.getConsumeSummaryList()
            })
          }, 100)
          break
        case 'coupon':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.couponRef.getSummaryList()
            })
          }, 100)
          break
        case 'oil':
          // 油品统计
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.oilRef.getSummaryList()
            })
          }, 100)
          break
        case 'debt':
          // 欠账明细
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.debtRef.getSummaryList()
            })
          }, 100)
          break
        case 'kzls':
          // 开支明细
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.kzlsRef.getSummaryList()
            })
          }, 100)
          break
        case 'user':
          // 员工明细
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.userRef.getSummaryList()
            })
          }, 100)
          break
        case 'integral':
          // 积分明细
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.integralRef.getSummaryList()
            })
          }, 100)
          break
        case 'balance':
          // 储值明细
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.balanceRef.getSummaryList()
            })
          }, 100)
          break
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
