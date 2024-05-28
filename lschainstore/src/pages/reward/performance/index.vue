<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xs">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          
          <q-tab name="1" label="业绩提成" />
          <q-tab name="2" label="提成记录" />
        </q-tabs>
        <q-separator />
      </div>
      
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '1'">
        <performance></performance>
      </div>
       <div class="col-shrink full-height bg-grey-2" v-if="tab == '2'">
        <performance-record></performance-record>
      </div>
    </div>
  </q-page>
</template>
<script>

import Performance from './components/Performance'
import PerformanceRecord from './components/PerformanceRecord'
export default {
  name: 'printerIndex',
  components: {
    Performance,
    PerformanceRecord
  },
  data() {
    return {
      tab: '1',
    }
  },
  mounted() {},
  computed: {},
  created() {
     if (this.$route.params && this.$route.params.tab) {
      this.tab = this.$route.params.tab
    }
  },
  methods: {

  },
}
</script>
<style></style>
