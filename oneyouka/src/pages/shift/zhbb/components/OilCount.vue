<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-pb-xs text-subtitle2">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
        <q-tab name="oilInfo" label="油品统计" />
        <q-tab name="oilInOutCount" label="油品进入库统计" />
        <q-tab name="oilCan" label="油罐统计" />
      </q-tabs>
    </div>

    <div class="col-shrink full-height bg-white" v-if="tab == 'oilInfo'">
      <oil-info-count ref="oilInfoRef"></oil-info-count>
    </div>
    <div class="col-shrink full-height bg-white" v-if="tab == 'oilInOutCount'">
      <oil-in-count ref="oilInOutRef"></oil-in-count>
    </div>
    <div class="col-shrink full-height bg-white" v-if="tab == 'oilCan'">
      <oil-can-count ref="oilCanRef"></oil-can-count>
    </div>
  </div>
</template>

<script>
import OilInfoCount from './OilInfoCount.vue'
import OilCanCount from './OilCanCount.vue'
import OilInCount from './OilInCount.vue'
export default {
  components: {
    OilInfoCount,
    OilCanCount,
    OilInCount
  },
  name: 'OilCount',
  data () {
    return {
      tab: 'oilInfo',
      endTime: '',
      couponsType: ''
    }
  },
  watch: {},
  created () {},
  computed: {},
  mounted () {},
  methods: {
    // 搜索
    searchBut () {
      switch (this.tab) {
        case 'oilGun':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.oilGunRef.getSummaryList()
            })
          }, 100)
          break
        case 'oilInfo':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.oilInfoRef.getSummaryList()
            })
          }, 100)
          break
        case 'oilInOut':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.oilInOutRef.getSummaryList()
            })
          }, 100)
          break
        case 'oilCan':
          // 计次消费
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.oilCanRef.getSummaryList()
            })
          }, 100)
          break
      }
    }
  }
}
</script>

<style></style>
