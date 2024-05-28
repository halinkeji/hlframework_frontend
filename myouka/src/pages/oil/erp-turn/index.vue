<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="turntab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="turnout" label="调出" />
          <q-tab name="turnback" label="调回" />
          <q-tab name="turnin" label="取回" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="turntab == 'turnout'">
        <turn-out></turn-out>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="turntab == 'turnback'">
        <turn-back-list></turn-back-list>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="turntab == 'turnin'">
        <turn-in></turn-in>
      </div>

    </div>
  </q-page>
</template>
<script>
import TurnOut from './TurnOut.vue'
import TurnIn from './TurnIn.vue'
import TurnBackList from './TurnBackList.vue'
export default {
  name: 'turnoil',
  components: {
    TurnOut,
    TurnIn,
    TurnBackList
  },
  data () {
    return {
      turntab: 'turnout'
    }
  },
  created () {},
  methods: {}
}
</script>
