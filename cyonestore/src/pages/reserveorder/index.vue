<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs v-model="reserveTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="calendar" label="预约管理" />
          <q-tab name="1" label="预约列表" />
          <q-tab name="2" label="预约设置" />
        </q-tabs>
      </div>

      <div class="col-shrink q-mt-xs full-height " v-if="reserveTab == 'calendar'">
          <reserve-calendar></reserve-calendar>
      </div>

      <div class="col-shrink q-mt-xs full-height " v-if="reserveTab == '1'">
          <reserve-lists></reserve-lists>
      </div>
      <div class="col-shrink q-mt-xs full-height " v-if="reserveTab == '2'">
          <reserve-config></reserve-config>
      </div>
      <div class="col-shrink bg-white q-pb-md"></div>
    </div>
  </q-page>

</template>
<script>
import reserveConfig from './reserveConfig'
import reserveLists from './reserveLists'
import ReserveCalendar from './ReserveCalendar'

export default {
  name: 'reserveOrder',
  components: {
    reserveConfig,
    reserveLists,
    ReserveCalendar
  },
  data () {
    return {
      reserveTab: 'calendar'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
