<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="activeName" class="bg-white" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense>
          <q-tab name="membertagList" label="会员列表"> </q-tab>
          <q-tab name="membertagCount" label="标签统计"> </q-tab>
          <q-tab name="addMembertag" label="标签管理"> </q-tab>
        </q-tabs>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'membertagList'">
        <membertag-list></membertag-list>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'membertagCount'">
        <membertag-count></membertag-count>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'addMembertag'">
        <add-membertag></add-membertag>
      </div>
    </div>
  </q-page>
</template>
<script>
import MembertagList from './components/MembertagList.vue'
import MembertagCount from './components/MembertagCount.vue'
import AddMembertag from './components/AddMembertag.vue'
export default {
  components: { MembertagList, MembertagCount, AddMembertag },
  name: 'index',
  data () {
    return {
      activeName: 'membertagList'
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
