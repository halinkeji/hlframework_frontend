<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs ">
        <!-- <div class="row justify-center">
          <h6 class="no-margin">在购单据信息</h6>
          <q-space />
          <q-btn unelevated flat round dense icon="close" v-close-popup />
        </div> -->
        <q-tabs
          v-model="activeName"
          class="bg-white q-my-sm"
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-btn color="grey" unelevated :to="{ name: 'erpNumber' }" label="返回" />
          <q-tab name="0" label="采购单记录"> </q-tab>
          <q-tab name="1" label="订货单记录"> </q-tab>
          <q-tab name="2" label="配货单记录"> </q-tab>
          <q-tab name="3" label="调拨单记录"> </q-tab>
          <q-tab name="4" label="门店退货单记录"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '0'">
        <purchase-list :goods="goodsId" :archives_id="archives_id" />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '1'">
        <order-view :goods="goodsId" :archives_id="archives_id" />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '2'">
        <allocation-view :goods="goodsId" :archives_id="archives_id" />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '3'">
        <transfer-view :goods="goodsId" :archives_id="archives_id" :type="1" />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '4'">
        <store-return-view :goods="goodsId" :archives_id="archives_id" />
      </div>
    </div>
  </q-page>
</template>

<script>
import OrderView from './OrderView.vue'
import AllocationView from './AllocationView.vue'
import TransferView from './TransferView.vue'
import StoreReturnView from './StoreReturnView.vue'
import PurchaseList from './PurchaseList.vue'

import AgInput from 'pages/erp/purchase/components/AgInput'

export default {
  name: 'PurchaseView',
  components: { OrderView, AllocationView, TransferView, StoreReturnView, AgInput, PurchaseList },
  data () {
    return {

      activeName: '0',
      context: null,
      components: {
        AgInput
      }

    }
  },

  computed: {},
  created () {
    this.goodsId = this.$route.query.id
    this.archives_id = this.$route.query.archives_id

    this.context = this
  },
  mounted () {},
  methods: {

  }
}
</script>
