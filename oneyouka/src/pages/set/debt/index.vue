<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-py-sm text-subtitle2 row">
        <q-tabs v-model="debtTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
            <q-tab name="operate" label="还款" />
          <q-tab name="record" label="记录" />
        </q-tabs>
      </div>
       <div class="col-shrink full-height bg-white" v-if="debtTab == 'record'">
        <record />
       </div>

        <div class="col-shrink full-height bg-white" v-if="debtTab == 'operate'">
        <repayment />
       </div>
    </div>
  </q-page>
</template>
<script>
import Repayment from './Repayment.vue'
import Record from './Record.vue'
export default {
  name: 'DebtRecord',
  components: {
    Record,
    Repayment
  },
  data () {
    return {
      debtTab: 'operate'
    }
  },
  created () {},
  methods: {}
}
</script>
