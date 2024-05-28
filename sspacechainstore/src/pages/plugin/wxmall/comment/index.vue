<template>
  <!-- <q-page class="fit"> -->
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
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
        <q-tab label="评价记录" name="record"></q-tab>
         <q-tab label="评价分析" name="chart"></q-tab>
        <q-tab label="评价设置" name="set"></q-tab>
      </q-tabs>
    </div>

    <div class="col-shrink bg-white full-height bg-grey-2 fit q-mt-xs" v-if="activeName == 'record'">
      <record-data></record-data>
    </div>
       <div class="col-shrink bg-white full-height bg-grey-2 fit q-mt-xs" v-if="activeName == 'chart'">
      <chart-data></chart-data>
    </div>
    <div class="col-shrink bg-white full-height bg-grey-2 fit q-mt-xs" v-if="activeName == 'set'">
      <set-config></set-config>
    </div>
  </div>
  <!-- </q-page> -->
</template>

<script>
import RecordData from './Record.vue'
import SetConfig from './Set.vue'
import ChartData from './Chart.vue'

export default {
  name: 'commentManage',
  props: [],
  components: {
    RecordData,
    SetConfig,
    ChartData
  },
  data () {
    return {
      activeName: 'record'
    }
  },
  watch: {},
  mounted () {},

  created () {},
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

<style></style>
