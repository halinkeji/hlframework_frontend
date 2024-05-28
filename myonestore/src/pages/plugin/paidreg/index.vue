<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm ">
        <q-tabs v-model="paidregTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="1" label="开卡套餐" v-if="authorityMeta('package')" />
          <q-tab name="2" label="开卡设置" v-if="authorityMeta('config')" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(paidregTab) == 1">
        <paidreg-package></paidreg-package>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(paidregTab) == 2">
        <paidreg-config></paidreg-config>
      </div>
    </div>
  </q-page>
</template>
<script>
import paidregConfig from './Config'
import paidregPackage from './Package'
export default {
  name: 'paidreg',
  components: {
    paidregConfig,
    paidregPackage
  },
  data () {
    return {
      paidregTab: '1'
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
        }
      }
      return false
    }
  }
}
</script>
