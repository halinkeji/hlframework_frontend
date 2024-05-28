<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-tabs v-model="reserveTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="1" label="预约管理" v-if="authorityMeta('manage')" />
          <q-tab name="2" label="预约项目" v-if="authorityMeta('project')" />
          <q-tab name="3" label="预约分类" v-if="authorityMeta('type')" />
        </q-tabs>
      </div>
      <div class="col-shrink full-height" v-if="parseInt(reserveTab) == 1">
        <reserve-manage></reserve-manage>
      </div>
      <div class="col-shrink full-height" v-if="parseInt(reserveTab) == 2">
        <reserve-project></reserve-project>
      </div>
      <div class="col-shrink full-height" v-if="parseInt(reserveTab) == 3">
        <reserve-type></reserve-type>
      </div>
    </div>
  </q-page>
</template>
<script>
import ReserveType from './type/index'
import ReserveProject from './project/index'
import ReserveManage from './record/index'
export default {
  name: 'reserve',
  components: {
    ReserveType,
    ReserveProject,
    ReserveManage
  },
  data () {
    return {
      reserveTab: '1'
    }
  },
  mounted () {},
  created () {},
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
