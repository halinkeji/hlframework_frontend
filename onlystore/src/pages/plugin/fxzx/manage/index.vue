<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="all" label="全部" />
          <q-tab name="wait" label="待审核" />
        </q-tabs>
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white" v-if="tab == 'all'">
        <all-wait-list />
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white" v-if="tab == 'wait'">
        <wait-list />
      </div>
    </div>
  </q-page>
</template>
<script>
import AllWaitList from '../member/index.vue'
import WaitList from '../wait/index.vue'
export default {
  name: 'fxzxAllList',
  components: {
    AllWaitList,
    WaitList
  },
  data () {
    return {
      tab: 'all'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
