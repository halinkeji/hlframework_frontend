<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs v-model="tab" indicator-color="primary" dense active-color="primary" class="text-grey-8" align="left" inline-label>
          <q-tab name="4" label="我的模板" />
          <q-tab name="2" label="消息提醒" />
          <!-- <q-tab name="3" label="模板管理" />
          <q-tab name="1" label="群发任务" />
          <q-tab name="5" label="进程设置" /> -->
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(tab) == 1">
        <first-tab />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(tab) == 2">
        <section-tab />
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(tab) == 3">
        <third-tab />
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(tab) == 4">
        <fourth-tab />
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(tab) == 5">
        <five-tab />
      </div>
    </div>
  </q-page>
</template>

<script>
import FirstTab from './components/FirstTab.vue'
import FiveTab from './components/FiveTab.vue'
import FourthTab from './components/FourthTab.vue'
import SectionTab from './components/SectionTab.vue'
import ThirdTab from './components/ThirdTab.vue'
export default {
  components: { FirstTab, SectionTab, FourthTab, FiveTab, ThirdTab },
  name: 'template',
  data () {
    return {
      tab: '4'
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {}
}
</script>

<style></style>
