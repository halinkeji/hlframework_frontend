<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-tabs v-model="reserveTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="4" label="预订管理" />
           <q-tab name="1" label="预订记录" />
          <q-tab name="2" label="预订设置" />
        </q-tabs>
      </div>
      <div class="col-shrink full-height " v-if="parseInt(reserveTab) == 4">
        <reserve-calendar></reserve-calendar>
      </div>

       <div class="col-shrink full-height " v-if="parseInt(reserveTab) == 1">

        <reserve-record></reserve-record>
      </div>

      <div class="col-shrink full-height " v-if="parseInt(reserveTab) == 2">

        <reserve-config></reserve-config>
      </div>

    </div>
  </q-page>
</template>
<script>
import ReserveCalendar from './components/ReserveCalendar'
import ReserveConfig from './components/ReserveConfig'
import ReserveRecord from './components/ReserveRecord'

export default {
  name: 'book-manage',
  components: {
    ReserveCalendar,
    ReserveConfig,
    ReserveRecord
  },
  data () {
    return {
      reserveTab: '4'
    }
  },
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
