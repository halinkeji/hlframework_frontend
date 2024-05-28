<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-tabs v-model="infoTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="record" label="用户信息" />
          <q-tab name="config" label="基础配置" v-if="authorityMeta('config')" />
        </q-tabs>
      </div>
       <div class="col-shrink full-height" v-if="infoTab == 'record'">
        <user-record></user-record>
      </div>
      <div class="col-shrink full-height" v-if="infoTab == 'config'">
        <system-config></system-config>
      </div>
    </div>
  </q-page>
</template>
<script>
import SystemConfig from './Config'
import UserRecord from './Record'
export default {
  components: {
    SystemConfig,
    UserRecord
  },
  data () {
    return {
      infoTab: 'record'
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    authorityMeta (key) {
      // return true
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
