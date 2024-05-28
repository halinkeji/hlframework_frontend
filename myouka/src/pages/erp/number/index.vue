<template>
  <q-page class="fit">
    <!-- <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll" >
      <div class="col-shrink bg-white q-px-xs q-pb-sm"> -->
        <!-- <q-tabs
          v-model="activeName"
          class="bg-white q-mt-sm"
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        > -->
          <!-- <q-tab name="0">
            <span>
              库存管理
            </span>
          </q-tab>
          <q-tab name="2">
            <span>
              库存查询
            </span>
          </q-tab> -->
          <!-- <q-tab name="1">
            <span>
              进价分析
            </span>
          </q-tab> -->
        <!-- </q-tabs>
      </div> -->

      <!-- <div
        class="col-shrink full-height bg-grey-2"
        v-if="parseInt(activeName) == 0"
      > -->
        <goods-number></goods-number>
      <!-- </div>

      <div
        class="col-shrink full-height bg-grey-2"
        v-if="parseInt(activeName) == 1"
      >
        <cost-pice></cost-pice>
      </div>

       <div
        class="col-shrink full-height bg-grey-2"
        v-if="parseInt(activeName) == 2"
      >
        <number-inquire></number-inquire>
      </div> -->
    <!-- </div> -->
  </q-page>
</template>
<script>
import CostPice from './CostPice'
import GoodsNumber from './GoodsNumber'
// import NumberInquire from './NumberInquire'

export default {
  name: 'normal',
  components: {
    CostPice,
    GoodsNumber
    // NumberInquire
  },
  data () {
    return {
      activeName: '0'
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>
