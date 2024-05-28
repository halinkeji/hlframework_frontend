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
          <q-tab name="1" v-if="authorityMeta('outTab')">
            <span> 订货出库 </span>
          </q-tab>
          <q-tab name="5" v-if="authorityMeta('directOutTab')">
            <span> 直采出库 </span>
          </q-tab>
          <q-tab name="2" v-if="authorityMeta('transferTab')">
            <span> 调拨出库 </span>
          </q-tab>
          <q-tab name="3" v-if="authorityMeta('returnPurchase')">
            <span> 采购退货 </span>
          </q-tab>
          <q-tab name="6" v-if="authorityMeta('returnPurchaseOut')">
            <span>
              采购退货出库
            </span>
          </q-tab>
          <q-tab name="4" v-if="authorityMeta('storeout')">
            <span> 门店退货出库单 </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '1' && authorityMeta('outTab')">
        <out-tab></out-tab>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '2' && authorityMeta('transferTab')">
        <transfer-out />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '3' && authorityMeta('returnPurchase')">
        <return-purchase />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '4' && authorityMeta('storeout')">
        <store-out />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '5' && authorityMeta('directOutTab')">
        <direct-out></direct-out>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="parseInt(activeName) == '6' && authorityMeta('returnPurchaseOut')">
        <purchase-out />
      </div>
    </div>
  </q-page>
</template>

<script>
import OutTab from './components/OutTab.vue'
import TransferOut from 'pages/erp/transferout/index.vue'
import ReturnPurchase from 'pages/erp/return/purchase/index.vue'
import StoreOut from 'pages/erp/return/storeout/index.vue'
import DirectOut from 'pages/erp/direct/out/index.vue'

import purchaseOut from 'pages/erp/return/purchase-out/index.vue'
export default {
  name: 'outIndex',
  components: { OutTab, TransferOut, ReturnPurchase, StoreOut, DirectOut, purchaseOut },
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
