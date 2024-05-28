<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs text-subtitle2 q-mb-xs">
        <q-tabs
          v-model="activeName"
          class="bg-white q-mt-sm"
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-tab label="绩效记录" name="1"> </q-tab>
          <q-tab label="绩效标签" name="2"> </q-tab>
          <q-tab label="员工管理" name="3"> </q-tab>
          <q-tab label="职位管理" name="4"> </q-tab>
          <q-tab label="结算记录" name="6"> </q-tab>
          <q-tab label="功能设置" name="5"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height  " v-if="parseInt(activeName) == 1">
        <label-record :positionDataList="positionDataList"></label-record>
      </div>
      <div class="col-shrink full-height  " v-if="parseInt(activeName) == 2">
        <label-set></label-set>
      </div>
      <div class="col-shrink full-height  " v-if="parseInt(activeName) == 3">
        <position-user :positionDataList="positionDataList"></position-user>
      </div>
      <div class="col-shrink full-height  " v-if="parseInt(activeName) == 4">
        <position-index></position-index>
      </div>
        <div class="col-shrink full-height  " v-if="parseInt(activeName) == 5">
        <reward-config></reward-config>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == 6">
        <record></record>
      </div>
    </div>
  </q-page>
</template>
<script>
import LabelSet from './label/LabelSet.vue'
import LabelRecord from './label/LabelRecord.vue'
import positionIndex from './position/index.vue'
import positionUser from './user/Index.vue'
import RewardConfig from './Config.vue'
import Record from './Record.vue'
export default {
  name: 'rewardLabelIndex',
  components: {
    LabelRecord,
    LabelSet,
    positionIndex,
    positionUser,
    RewardConfig,
    Record
  },
  data () {
    return {
      activeName: '1',
      positionDataList: []
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getAllUserPosition()
  },
  methods: {
    getAllUserPosition () {
      this.$store.dispatch('rewardPosition/getAllPositionData').then((res) => {
        if (res.code == 200) {
          this.positionDataList = res.data ? res.data : []
        }
      })
    }
  }
}
</script>
