<template>
  <!-- <q-page class="fit"> -->
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
        <q-tab name="consume" v-if="authorityMeta('consum')">
          <span>
            业务消费
          </span>
        </q-tab>
        <q-tab name="rechargeCount" v-if="authorityMeta('rechargeCount')">
          <span>
            充次记录
          </span>
        </q-tab>
        <q-tab name="countConsume" v-if="authorityMeta('count')">
          <span>
            计次消费
          </span>
        </q-tab>
        <q-tab name="rechargeTime" v-if="authorityMeta('rechargeTime')">
          <span>
            充时记录
          </span>
        </q-tab>
        <q-tab name="timeConsume" v-if="authorityMeta('time')">
          <span>
            计时消费
          </span>
        </q-tab>

        <q-tab name="pointRecord" v-if="authorityMeta('integral')">
          <span>
            {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}记录
          </span>
        </q-tab>
        <q-tab name="moneyRecord" v-if="authorityMeta('balance')">
          <span>
            {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}记录
          </span>
        </q-tab>

        <q-tab name="returnRecord" v-if="authorityMeta('return')">
          <span>
            退货记录
          </span>
        </q-tab>
      </q-tabs>
    </div>
     <div class="col-shrink bg-white full-height bg-grey-2 fit" v-if="activeName != 'prefix'">
      <q-tab-panels v-model="activeName" animated transition-prev="fade" transition-next="fade" class="fit">
        <q-tab-panel class="q-ma-none q-pa-none fit" name="consume">
          <consumer-invoice :memberId="memberId" ref="cashier"></consumer-invoice>
        </q-tab-panel>

        <q-tab-panel class="q-ma-none q-pa-none fit" name="countConsume">
          <count-consumption :memberId="memberId" ref="countConsumeRef"></count-consumption>
        </q-tab-panel>
         <q-tab-panel class="q-ma-none q-pa-none fit" name="rechargeCount">
           <count-recharge :memberId="memberId" ref="rechargeCountRef"></count-recharge>
        </q-tab-panel>
        <q-tab-panel class="q-ma-none q-pa-none fit" name="rechargeTime">
          <time-recharge :memberId="memberId" ref="rechargeTimeRef"></time-recharge>
        </q-tab-panel>

        <q-tab-panel class="q-ma-none q-pa-none fit" name="timeConsume">
          <time-consumption :memberId="memberId" ref="timeConsumeRef"></time-consumption>
        </q-tab-panel>

        <q-tab-panel class="q-ma-none q-pa-none fit" name="pointRecord">
          <integral-record :memberId="memberId" ref="record"></integral-record>
        </q-tab-panel>
        <q-tab-panel class="q-ma-none q-pa-none fit" name="moneyRecord">
          <balance-details :memberId="memberId" ref="details"></balance-details>
        </q-tab-panel>
        <q-tab-panel class="q-ma-none q-pa-none fit" name="returnRecord">
          <return-record :memberId="memberId" ref="returnRecordRef"></return-record>
        </q-tab-panel>

      </q-tab-panels>
    </div>
  </div>
  <!-- </q-page> -->
</template>

<script>
import CountConsumption from './components/CountConsumption.vue' // 计次消费
import CountRecharge from './components/CountRecharge.vue' // 计次消费
import IntegralRecord from './components/IntegralRecord.vue'
import BalanceDetails from './components/BalanceDetails.vue'
import ConsumerInvoice from './components/ConsumerInvoice.vue' // 消费列表
import ReturnRecord from './components/ReturnRecord.vue' // 退货列表
import TimeConsumption from './components/TimeConsumption.vue' // 计时消费
import TimeRecharge from './components/TimeRecharge.vue' // 计时消费
export default {
  name: 'invoice',
  props: ['memberId'],
  components: {
    CountConsumption,
    IntegralRecord,
    BalanceDetails,
    ConsumerInvoice,
    ReturnRecord,
    TimeConsumption,
    CountRecharge,
    TimeRecharge
  },
  data () {
    return {
      status: [
        { value: 4, text: '未支付' },
        { value: 1, text: '支付成功' },
        { value: 2, text: '支付失败' },
        { value: 3, text: '退款成功' }
      ],
      searchFrom: {},
      activeName: 'consume'
    }
  },
  watch: {
    activeName () {
      this.searchBut()
    }
  },
  mounted () {},

  created () {},
  computed: {},
  methods: {
    // 搜索
    searchBut () {
      switch (this.activeName) {
        case 'consume':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.cashier.getDatalist()
            })
          }, 100)
          break
        case 'prefix':
          // 前缀
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.invoicePrefix.getPrefix()
            })
          }, 100)
          break
        case 'countConsume':
          // 计次消费
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.countConsumeRef.getDatalist()
            })
          }, 100)
          break
        case 'rechargeCount':
          // 充次记录
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.rechargeCountRef.getDatalist()
            })
          }, 100)
          break
        case 'rechargeTime':
          // 计时记录
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.rechargeTimeRef.getDatalist()
            })
          }, 100)
          break
        case 'timeConsume':
          // 计时记录
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.timeConsumeRef.getDatalist()
            })
          }, 100)
          break
        case 'pointRecord':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.record.getDatalist()
            })
          }, 100)
          break
        case 'moneyRecord':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.details.getDatalist()
            })
          }, 100)
          break
        case 'returnRecord':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.returnRecordRef.getDatalist()
            })
          }, 100)
          break
      }
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

<style></style>
