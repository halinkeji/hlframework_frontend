<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 " :class="tab == 'buy' ? 'q-mb-xs' : ''">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" align="left" indicator-color="primary" narrow-indicator>
          <q-tab name="buy" label="控制台" />
          <q-tab name="package" label="短信套餐包记录" />
          <q-tab name="record" label="购买记录" />
        </q-tabs>
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white" v-if="tab == 'buy'">
        <sms-buy />
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white" v-if="tab == 'package'">
        <sms-buy-package />
      </div>
      <div class="col-shrink full-height" v-if="tab == 'record'">
        <sms-buy-record />
      </div>
    </div>
  </q-page>
</template>
<script>
import SmsBuy from './SmsBuy.vue'
import SmsBuyRecord from './SmsBuyRecord.vue'
import SmsBuyPackage from './SmsBuyPackage.vue'

export default {
  name: 'smsMarketManage',
  components: {
    SmsBuyRecord,
    SmsBuy,
    SmsBuyPackage
  },
  data () {
    return {
      tab: 'buy'
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
