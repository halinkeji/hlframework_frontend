<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs v-model="setTab" dense class="text-grey" active-color="green-10" indicator-color="green-10" align="left" narrow-indicator>
          <q-tab name="record" label="排号管理" />
          <q-tab name="config" label="排号设置" />
        </q-tabs>
      </div>

      <div class="col-shrink q-mt-xs full-height " v-if="setTab == 'record'">
        <record-list></record-list>
      </div>
      <div class="col-shrink q-mt-xs full-height " v-if="setTab == 'config'">
        <paihao-config></paihao-config>
      </div>
    </div>
  </q-page>
</template>
<script>
import PaihaoConfig from './PaihaoConfig.vue'
import RecordList from './RecordList.vue'
export default {
  name: 'reserveOrder',
  components: {
    PaihaoConfig,
    RecordList
  },
  data () {
    return {
      setTab: 'record'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
