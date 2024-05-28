<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.8) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
        height: parseInt(this.$q.screen.width * 0.8) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md row">
          <q-tabs
            v-model="activeName"
            class="bg-white q-mt-sm"
            active-color="primary"
            indicator-color="primary"
            align="left"
            content-class="text-grey-9"
            narrow-indicator
            dense
            @input="getListSwitch"
          >
            <q-tab name="moneyRecord"> {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit }}记录 </q-tab>

            <q-tab name="pointRecord"> {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit }}记录 </q-tab>

            <q-tab name="coupon"> 卡券记录 </q-tab>
          </q-tabs>

          <q-space />
          <div class="q-pa-sm">
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </div>

        </div>

        <div class="col-shrink bg-white full-height bg-grey-2 fit" v-if="activeName == 'moneyRecord'">
           <balance-details ref="moneyRecordRef" :storeId="storeId" :startTime="startTime" :endTime="endTime" />
        </div>
        <div class="col-shrink bg-white full-height bg-grey-2 fit" v-if="activeName == 'pointRecord'" >
           <integral-record ref="pointRecordRef" :storeId="storeId" :startTime="startTime" :endTime="endTime"  />
        </div>
        <div class="col-shrink bg-white full-height bg-grey-2 fit" v-if="activeName == 'coupon'" >
           <used-coupon-list ref="couponRecordRef" :storeId="storeId" :startTime="startTime" :endTime="endTime"  />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import BalanceDetails from './BalanceDetails.vue'
import IntegralRecord from './IntegralRecord.vue'
import UsedCouponList from './UsedCouponList.vue'
export default {
  name: 'DetailManage',
  components: {
    BalanceDetails,
    IntegralRecord,
    UsedCouponList
  },
  data () {
    return {
      addStoreSidebar: false,
      activeName: 'moneyRecord',
      storeId: 0,
      startTime: '',
      endTime: ''
    }
  },
  watch: {

  },
  mounted () {},

  created () {},
  computed: {},
  methods: {
    init (storeId, startTime, endTime) {
      console.log('storeId, startTime, endTime', storeId, startTime, endTime)
      this.storeId = storeId
      this.startTime = startTime
      this.endTime = endTime
      this.addStoreSidebar = true

      this.$nextTick(() => {
        this.getListSwitch()
      })
    },
    hideNowPage () {
      this.$emit('colseDialog')
    },
    getListSwitch () {
      this.$nextTick(() => {
        switch (this.activeName) {
          case 'moneyRecord':
            this.$refs.moneyRecordRef.getDatalist()
            break
          case 'pointRecord':
            this.$refs.pointRecordRef.getDatalist()
            break
          case 'coupon':
            this.$refs.couponRecordRef.getUsedCouponList()
            break
        }
      })
    }

  }
}
</script>

<style></style>
