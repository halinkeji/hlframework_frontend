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
          <q-tab name="0" label="正常会员" v-if="authorityMeta('normalList')"> </q-tab>
          <q-tab name="1" label="过期会员" v-if="authorityMeta('expired')"> </q-tab>
          <q-tab name="2" label="会员回收站" v-if="authorityMeta('recycle')"> </q-tab>
          <q-tab name="3" label="未激活会员" v-if="authorityMeta('recycle')"> </q-tab>
        </q-tabs>
      </div>
      <div class="col-shrink full-height bg-grey-2">
        <div v-if="activeName == '0'" class="fit">
          <member-list :memberCardLevelDatas="memberCardLevelDatas"></member-list>
        </div>
        <div v-if="activeName == '1'" class="fit">
          <expired-member :memberCardLevelDatas="memberCardLevelDatas"></expired-member>
        </div>
        <div v-if="activeName == '2'" class="fit">
          <recycle-member :memberCardLevelDatas="memberCardLevelDatas"></recycle-member>
        </div>
        <div v-if="activeName == '3'" class="fit">
          <not-reg-member-list :memberCardLevelDatas="memberCardLevelDatas"></not-reg-member-list>
        </div>
      </div>
    </div>

  </q-page>
</template>
<script>
import MemberList from './components/MemberList.vue'
import ExpiredMember from './components/ExpiredMember.vue'
import RecycleMember from './components/RecycleMember.vue'
import NotRegMemberList from './components/NotRegMemberList.vue'

export default {
  components: { MemberList, ExpiredMember, RecycleMember, NotRegMemberList },
  name: 'memberIndex',
  data () {
    return {
      activeName: '0',
      memberCardLevelDatas: []
    }
  },
  mounted () {},
  created () {
    this.getLevel()
  },
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
    },
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.memberCardLevelDatas = res.data
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
<style></style>
