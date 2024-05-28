<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm">
        <q-tabs
          v-model="activeName"
          class="bg-white "
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-tab name="0" v-if="authorityMeta('member')">
            <span>
              日志管理
            </span>
          </q-tab>
          <q-tab name="1" v-if="authorityMeta('record')">
            <span>
              日志记录
            </span>
          </q-tab>
          <q-tab name="2" v-if="authorityMeta('config')">
            <span>
              日志设置
            </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink  full-height q-mt-xs" v-if="authorityMeta('member') && activeName == '0'">
        <member-list @goRecord="goRecord"></member-list>
      </div>
      <div class="col-shrink full-height q-mt-xs" v-if="authorityMeta('record') && activeName == '1'">
        <record-list></record-list>
      </div>

      <div class="col-shrink full-height q-mt-xs" v-if="authorityMeta('config') && activeName == '2'">
        <set-config></set-config>
      </div>
    </div>
  </q-page>
</template>

<script>
import MemberList from './MemberList.vue'
import RecordList from './RecordList.vue'
import SetConfig from './SetConfig.vue'
export default {
  name: 'track',
  components: { MemberList, RecordList, SetConfig },
  data() {
    return {
      activeName: '0',
    }
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    goRecord() {
      this.activeName = '1'
    },
    authorityMeta(key) {
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
  },
}
</script>
