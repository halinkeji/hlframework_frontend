<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="tab" dense indicator-color="primary" active-color="primary" align="left" inline-label class="bg-white">
          <q-tab name="1" label="套餐设置" />
          <q-tab name="2" label="赠送单据" />
        </q-tabs>
      </div>
      <div class="col-shrink  full-height bg-grey-2" v-if="tab=='1'">
        <mezs-package></mezs-package>
      </div>
      <div class="col-shrink  full-height bg-grey-2" v-if="tab=='2'">
        <pay-record></pay-record>
      </div>
    </div>
  </q-page>
</template>
<script>
import MezsPackage from './Package'
import PayRecord from './PayRecord.vue'
export default {
  name: 'mezs',
  components: {
    MezsPackage,
    PayRecord
  },
  data () {
    return {
      tab: '1'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
