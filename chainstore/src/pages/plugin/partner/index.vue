<template>
  <q-page class="fit">
    <div class="fit row no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-12 col-md-1 q-py-md">
        <q-tabs v-model="activeName" dense vertical class="text-grey" active-color="primary" indicator-color="primary" align="justify">
          <q-tab name="config" icon="las la-users-cog" label="合伙人设置" v-if="authorityMeta('config')" />
          <q-tab name="member" icon="las la-user-alt" label="会员合伙人" v-if="authorityMeta('member')" />
          <q-tab name="staff" icon="las la-user-tie" label="员工合伙人" v-if="authorityMeta('staff')" />
          <q-tab name="partner" icon="las la-user-clock" label="股东合伙人" v-if="authorityMeta('partner')" />
        </q-tabs>
      </div>
      <div class="col-12 col-md-11" v-if="activeName == 'config'">
        <set-config></set-config>
      </div>
      <div class="col-12 col-md-11" v-if="activeName == 'member'">
        <member-lists></member-lists>
      </div>
      <div class="col-12 col-md-11" v-if="activeName == 'staff'">
        <staff-list></staff-list>
      </div>
      <div class="col-12 col-md-11" v-if="activeName == 'partner'">
        <partner-list></partner-list>
      </div>
    </div>
  </q-page>
</template>
<script>
import SetConfig from './components/SetConfig.vue'
import MemberLists from './components/MemberLists.vue'
import StaffList from './components/StaffList.vue'
import PartnerList from './components/PartnerList.vue'
export default {
  name: 'partner',
  components: { SetConfig, MemberLists, StaffList, PartnerList },
  data () {
    return {
      activeName: 'config'
    }
  },
  computed: {},
  created () {},
  mounted () {},
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
