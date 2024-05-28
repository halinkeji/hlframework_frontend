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
          <q-tab name="waitcheck" label="待审核" v-if="authorityMeta('waitcheck')" />
          <q-tab name="waitamount" label="待打款" v-if="authorityMeta('waitamount')" />
          <q-tab name="takeamount" label="已打款" v-if="authorityMeta('takeamount')" />
          <q-tab name="null" label="无效订单" v-if="authorityMeta('null')" />
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'waitcheck'">
        <waitcheck-lists />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'waitamount'">
        <waitamount-list />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'takeamount'">
        <takeamount-list />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'null'">
        <null-list />
      </div>
    </div>
  </q-page>
</template>
<script>
import WaitcheckLists from './waitcheck/index.vue'
import WaitamountList from './waitamount/index.vue'
import TakeamountList from './takeamount/index.vue'
import NullList from './null/index.vue'
export default {
  name: 'partner',
  components: { WaitcheckLists, WaitamountList, TakeamountList, NullList },
  data () {
    return {
      activeName: 'waitcheck'
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
