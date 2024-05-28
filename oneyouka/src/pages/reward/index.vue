<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xs">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="3" label="员工管理" />
          <q-tab name="1" label="职位管理" />
          <q-tab name="2" label="绩效汇总记录" />
        </q-tabs>
        <q-separator />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '3'">
        <user-manage></user-manage>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '1'">
        <position-record></position-record>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '2'">
        <record></record>
      </div>
    </div>
  </q-page>
</template>
<script>
// import PositionRecord from './components/PositionRecord'
// import Record from './components/Record'
// import UserManage from './components/UserManage'
export default {
  name: 'printerIndex',
  components: {
    // Record,
    // PositionRecord,
    // UserManage,
  },
  data () {
    return {
      tab: '3'
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>
<style></style>
