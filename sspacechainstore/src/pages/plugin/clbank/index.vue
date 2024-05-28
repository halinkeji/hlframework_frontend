<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="record" label="存取记录" v-if="authorityMeta('record')" />
          <q-tab name="chart" label="存取统计" v-if="authorityMeta('chart')" />
          <q-tab name="unit" label="材料库" v-if="authorityMeta('unit')" />
          <q-tab name="rule" label="存取规则" v-if="authorityMeta('rule')" />
        </q-tabs>
      </div>
      <div class="col-shrink full-height" v-if="tab == 'record'">
        <record-manage></record-manage>
      </div>

      <div class="col-shrink full-height" v-if="tab == 'chart'">
        <record-chart></record-chart>
      </div>

      <div class="col-shrink full-height" v-if="tab == 'unit'">
        <unit-manage></unit-manage>
      </div>

       <div class="col-shrink full-height" v-if="tab == 'rule'">
        <rule-manage></rule-manage>
      </div>
    </div>
  </q-page>
</template>
<script>
import RecordManage from './record/index'
import RecordChart from './Chart'
import UnitManage from './unit/index'
import RuleManage from './rule/index'

export default {
  name: 'clbankManage',
  components: {
    RecordManage,
    RecordChart,
    UnitManage,
    RuleManage
  },
  data () {
    return {
      tab: 'record'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    authorityMeta (key) {
      // return true
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
