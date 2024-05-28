<template>
  <!-- <q-page class="fit"> -->
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-tabs v-model="activeName" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
        <q-tab name="consume">
          <span>
            业务消费
          </span>
        </q-tab>
        <q-tab name="rechargeCount" >
          <span>
            充次记录
          </span>
        </q-tab>
         <q-tab name="countConsume" >
          <span>
            计次消费
          </span>
        </q-tab>
        <q-tab name="rechargeTime" >
          <span>
            充时记录
          </span>
        </q-tab>
        <q-tab name="timeConsume" >
          <span>
            计时消费
          </span>
        </q-tab>

        <q-tab name="returnRecord" >
          <span>
            退货记录
          </span>
        </q-tab>

      </q-tabs>
    </div>

    <div class="col-shrink bg-white full-height bg-grey-2 fit">
      <q-tab-panels v-model="activeName" animated transition-prev="fade" transition-next="fade" class="fit">
        <q-tab-panel class="q-ma-none q-pa-none fit" name="consume">
          <consumer-invoice :mPmerchantId="mPmerchantId" ref="cashier"></consumer-invoice>
        </q-tab-panel>

        <q-tab-panel class="q-ma-none q-pa-none fit" name="countConsume">
          <count-consumption :mPmerchantId="mPmerchantId" ref="countConsumeRef"></count-consumption>
        </q-tab-panel>

        <q-tab-panel class="q-ma-none q-pa-none fit" name="rechargeCount">
           <count-recharge :mPmerchantId="mPmerchantId" ref="rechargeCountRef"></count-recharge>
        </q-tab-panel>
        <q-tab-panel class="q-ma-none q-pa-none fit" name="rechargeTime">
          <time-recharge :mPmerchantId="mPmerchantId" ref="rechargeTimeRef"></time-recharge>
        </q-tab-panel>

        <q-tab-panel class="q-ma-none q-pa-none fit" name="timeConsume">
          <time-consumption :mPmerchantId="mPmerchantId" ref="timeConsumeRef"></time-consumption>
        </q-tab-panel>

        <q-tab-panel class="q-ma-none q-pa-none fit" name="returnRecord">
          <return-record :mPmerchantId="mPmerchantId" ref="returnRecordRef"></return-record>
        </q-tab-panel>
      </q-tab-panels>
    </div>

  </div>
  <!-- </q-page> -->
</template>

<script>
import CountConsumption from './components/CountConsumption.vue' // 计次消费
import CountRecharge from './components/CountRecharge.vue' // 计次消费
import ConsumerInvoice from './components/ConsumerInvoice.vue' // 消费列表
import ReturnRecord from './components/ReturnRecord.vue' // 退货列表
import TimeConsumption from './components/TimeConsumption.vue' // 计时消费
import TimeRecharge from './components/TimeRecharge.vue' // 计时消费

export default {
  name: 'invoice',
  props: ['memberId', 'mPmerchantId'],
  components: {
    CountConsumption,

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
