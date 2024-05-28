<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
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
          <q-tab name="0" label="采购入库记录"> </q-tab>
          <q-tab name="1" label="退货入库记录"> </q-tab>
          <q-tab name="2" label="采购退货记录"> </q-tab>
          <q-tab name="3" label="出库单记录"> </q-tab>
          <!-- <q-tab name="5" label="销售记录"> </q-tab> -->
          <q-tab name="7" label="库存调整记录"> </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '0'">
        <purchase-list-view :goods="goodsId" :archives_id="archives_id" />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '1'">
        <store-return-view :goods="goodsId" :archives_id="archives_id" />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '2'">
        <out-view :goods="goodsId" :archives_id="archives_id"></out-view>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '3'">
        <out-return-view :goods="goodsId" :archives_id="archives_id"  />
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '5'">
        <consum-view :goods="goodsId" :archives_id="archives_id"></consum-view>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == '7'">
        <change-number-view :goods="goodsId" :archives_id="archives_id"></change-number-view>
      </div>
    </div>
  </q-page>
</template>
<script>
import ConsumView from './ConsumView.vue'
import OutView from './OutView.vue'
import OutReturnView from './OutReturnView.vue'
import StoreReturnView from './StoreInView.vue'
import ChangeNumberView from './ChangeNumberView.vue'
import PurchaseListView from './PurchaseListView.vue'
export default {
  components: {
    OutView,
    OutReturnView,
    ConsumView,
    StoreReturnView,
    ChangeNumberView,
    PurchaseListView
  },
  name: 'viewdata',
  data () {
    return {
      activeName: '0',
      gridOptions: {},
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      inData: [],
      goodsId: 0,
      localeText: this.$ag_grid_localeText,
      archives_id: 0

    }
  },
  computed: {},
  created () {
    this.archives_id = this.$route.query.archives_id
    this.goodsId = this.$route.query.id
  },
  mounted () {},
  methods: {

  }
}
</script>
