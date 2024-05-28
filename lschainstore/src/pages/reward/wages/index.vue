<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xs">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="1" label="工资发放记录" />
          <q-tab name="2" label="补助发放记录" />
        </q-tabs>
        <q-separator />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '1'">
        <user-manage></user-manage>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '2'">
        <record></record>
      </div>
    </div>
  </q-page>
</template>
<script>

import Record from './components/Record'
import UserManage from './components/UserManage'
export default {
  name: 'wagesIndex',
  components: {
    Record,
    UserManage,
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
