<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xs">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="1" label="销售指数" />
          <q-tab name="2" label="门店指标设置" />
          <q-tab name="3" label="指标设置记录" />
        </q-tabs>
        <q-separator />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '1'">
        <store-calendar></store-calendar>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '2'">
        <indicators-show></indicators-show>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="tab == '3'">
        <record></record>
      </div>
    </div>
  </q-page>
</template>
<script>
import IndicatorsShow from './components/IndicatorsShow';
import StoreCalendar from './components/StoreCalendar';
import Record from './components/Record';
export default {
  name: 'IndicatorsIndex',
  components: {
    IndicatorsShow,
    StoreCalendar,
    Record,
  },
  data() {
    return {
      tab: '1',
    };
  },
  mounted() {},
  computed: {},
  created() {
    if (this.$route.params && this.$route.params.tab) {
      this.tab = this.$route.params.tab;
    }
  },
  methods: {
    authorityMeta(key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id;
        });
        if (new_arr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>
<style></style>
