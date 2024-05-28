<template>
  <div class="q-pa-xs">
    <shift-date @getPeriod="getSummaryList" v-if="selectTimeStatus" />
    <div class="row">
      <div class="col-12 q-pa-sm">
        <total-count :consumeData="consumeData"></total-count>
      </div>
      <div class="col-6 q-pa-sm">
        <discount-Count :discountData="discountData"></discount-Count>
      </div>
      <div class="col-6 q-pa-sm">
        <balance-and-integral :balanceAndIntegralData="balanceAndIntegralData"></balance-and-integral>
      </div>
    </div>
  </div>
</template>
<script>
import TotalCount from './components/TotalCount.vue'
import DiscountCount from './components/DiscountCount.vue'
import BalanceAndIntegral from './components/BalanceAndIntegral.vue'
import ShiftDate from './time.vue'
export default {
  name: 'reportIndex',
  components: {
    TotalCount,
    DiscountCount,
    BalanceAndIntegral,
    ShiftDate
  },
  data () {
    return {
      consumeData: [],
      balanceAndIntegralData: [],
      discountData: []
    }
  },
  props: {
    selectTimeStatus: {
      default: true
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    // 获取汇总数据
    getSummaryList (startTime, endTime) {
      const obj = {
        startTime,
        endTime
      }
      this.$store
        .dispatch('shift/getSummary', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumeData = res.data.consumeData
            this.balanceAndIntegralData = res.data.balanceAndIntegral
            this.discountData = res.data.discountData
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    }
  }
}
</script>
