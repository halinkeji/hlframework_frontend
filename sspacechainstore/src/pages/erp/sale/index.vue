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
          <q-tab name="saleTab">
            <span> 销货单据 </span>
          </q-tab>
          <q-tab name="saleOutTab">
            <span> 销货退货单据 </span>
          </q-tab>
        </q-tabs>
      </div>

      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'saleTab'">
        <sale-tab></sale-tab>
      </div>
      <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'saleOutTab'">
        <sale-out-tab></sale-out-tab>
      </div>
    </div>
  </q-page>
</template>
<script>
import SaleTab from './components/SaleTab'
import SaleOutTab from './components/SaleOutTab'
export default {
  name: 'index',
  components: {
    SaleOutTab,
    SaleTab
  },
  data () {
    return {
      activeName: 'saleTab'
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>

<style></style>
