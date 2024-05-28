<template>
  <q-page class="fit">
    <div
      class="fit column no-wrap justify-between items-stretch content-stretch no-scroll"
    >
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
          <q-tab name="0">
            <span>
              入库单据
            </span>
          </q-tab>
          <q-tab name="1">
            <span>
              退货单据
            </span>
          </q-tab>
        </q-tabs>
      </div>

      <div
        class="col-shrink  full-height bg-grey-2"
        v-if="parseInt(activeName) == 0"
      >
        <in-tab></in-tab>
      </div>
      <div
        class="col-shrink  full-height bg-grey-2"
        v-if="parseInt(activeName) == 1"
      >
        <out-tab></out-tab>
      </div>
    </div>
  </q-page>
</template>
<script>
import InTab from './components/InTab'
import OutTab from './components/OutTab'
export default {
  name: 'index',
  components: {
    OutTab,
    InTab
  },
  data () {
    return {
      activeName: '0'
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>

<style></style>
