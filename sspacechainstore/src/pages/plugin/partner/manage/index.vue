<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
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
          <q-tab name="member" label="会员合伙人" v-if="authorityMeta('member')" />
          <q-tab name="staff" label="员工合伙人" v-if="authorityMeta('staff')" />
          <q-tab name="partner" label="股东合伙人" v-if="authorityMeta('partner')" />
          <q-tab name="waitmember" label="待审核合伙人" v-if="authorityMeta('waitmember')" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'member'">
        <member-lists></member-lists>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'staff'">
        <staff-list></staff-list>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'partner'">
        <partner-list></partner-list>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'waitmember'">
        <waitmember-list></waitmember-list>
      </div>
    </div>
  </q-page>
</template>
<script>
import MemberLists from './components/MemberLists.vue'
import StaffList from './components/StaffList.vue'
import PartnerList from './components/PartnerList.vue'
import WaitmemberList from '@/pages/plugin/partner/wait/index.vue'
export default {
  name: 'partner',
  components: { MemberLists, StaffList, PartnerList, WaitmemberList },
  data () {
    return {
      activeName: 'member'
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    authorityMeta (key) {
      return true
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
