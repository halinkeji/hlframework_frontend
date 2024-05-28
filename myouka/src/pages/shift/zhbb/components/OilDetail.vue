<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-pb-xs text-subtitle2">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>

        <q-tab name="oilInfo" label="油品明细" />
        <q-tab name="oilInOut" label="油品进入库明细" />
        <q-tab name="oilCan" label="油罐明细" />
      </q-tabs>
    </div>

    <div class="col-shrink full-height bg-white" v-if="tab == 'oilInfo'">
      <oil-info-detail ref="oilInfoRef"></oil-info-detail>
    </div>
    <div class="col-shrink full-height bg-white" v-if="tab == 'oilInOut'">
      <oil-inout-detail ref="oilInOutRef"></oil-inout-detail>
    </div>
    <div class="col-shrink full-height bg-white" v-if="tab == 'oilCan'">
      <oil-can-detail ref="oilCanRef"></oil-can-detail>
    </div>
  </div>
</template>

<script>

import OilInfoDetail from './OilInfoDetail.vue'
import OilInoutDetail from './OilInOutDetail.vue'
import OilCanDetail from './OilCanDetail.vue'
export default {
  components: {
    OilInfoDetail,
    OilInoutDetail,
    OilCanDetail
  },
  name: 'OilDetail',
  data () {
    return {
      tab: 'oilInfo',
      endTime: '',
      couponsType: ''
    }
  },
  watch: {

  },
  created () {},
  computed: {},
  mounted () {

  },
  methods: {

  }
}
</script>

<style></style>
