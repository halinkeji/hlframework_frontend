<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-xs">
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
          <q-tab name="1" v-if="authorityMeta('in')">
            <span> 采购入库 </span>
          </q-tab>
          <q-tab name="2" v-if="authorityMeta('orderIn')">
            <span> 订货入库 </span>
          </q-tab>
          <q-tab name="5" v-if="authorityMeta('directIn')">
            <span> 直采入库 </span>
          </q-tab>
          <q-tab name="3" v-if="authorityMeta('storeIn')">
            <span> 退货入库 </span>
          </q-tab>
          <q-tab name="4" v-if="authorityMeta('transferIn')">
            <span> 调拨入库 </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '1' && authorityMeta('in')">
        <in-tab></in-tab>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '2' && authorityMeta('orderIn')">
        <order-in></order-in>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '3' && authorityMeta('storeIn')">
        <store-in></store-in>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '4' && authorityMeta('transferIn')">
        <transfer-in></transfer-in>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '5' && authorityMeta('directIn')">
        <direct-in></direct-in>
      </div>
    </div>
  </q-page>
</template>

<script>
import InTab from './components/InTab.vue'
import OrderIn from 'pages/erp/orderin/index.vue'
import StoreIn from 'pages/erp/return/storein/index.vue'
import TransferIn from 'pages/erp/transferin/index.vue'
import DirectIn from 'pages/erp/direct/in/index.vue'
export default {
  name: 'inIndex',
  components: { InTab, OrderIn, StoreIn, TransferIn, DirectIn },
  data () {
    return {
      activeName: '1'
    }
  },
  mounted () {},
  watch: {},
  created () {
    if (this.$route.params && this.$route.params.tab) {
      this.activeName = this.$route.params.tab
    }
  },
  computed: {},
  methods: {
    authorityMeta (key) {
      return true
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

<style></style>
