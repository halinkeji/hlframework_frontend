<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-tabs v-model="configTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="chart" label="评价统计" />
          <q-tab name="record" label="评价记录" />
          <q-tab name="config" label="评价设置" />
        </q-tabs>
      </div>
      <div class="col-shrink full-height  " v-if="configTab == 'chart'">
        <chart-count></chart-count>
      </div>
      <div class="col-shrink full-height  " v-if="configTab == 'record'">
        <comment-record></comment-record>
      </div>
      <div class="col-shrink full-height  " v-if="configTab == 'config'">
        <comment-config></comment-config>
      </div>
    </div>
  </q-page>
</template>
<script>
import CommentConfig from './Config'
import CommentRecord from './Record'
import ChartCount from './Chart'

export default {
  name: 'commentManage',
  components: {
    CommentConfig,
    CommentRecord,
    ChartCount
  },
  data () {
    return {
      configTab: 'chart'
    }
  },
  created () {},
  mounted () {},
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
    }
  }
}
</script>
