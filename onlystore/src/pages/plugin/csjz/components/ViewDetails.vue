<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row q-pa-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <div class="row text-h6 q-px-md">
          单据详情
        </div>
        <div class="bg-white q-pa-sm">
          <div class="text-center text-h5">{{ invoiceData.pco_activity_price }}</div>
          <q-separator class="q-my-sm" />
          <div class="row q-pa-sm" v-if="invoiceData && invoiceData.store">
            <div class="col">{{ invoiceData.store.name }}</div>
            <div class="col text-right text-grey">慈善捐赠</div>
          </div>
          <q-separator class="q-my-sm" />
          <div class="row q-pa-sm">
            <div class="col">创建时间</div>
            <div class="col text-right text-grey">{{ $q_date.formatDate(invoiceData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
          </div>

          <div class="row q-pa-sm">
            <div class="col">{{ invoiceData.pco_donate_property == 'personal' ? '个人捐赠' : '单位/企业捐赠' }}</div>
            <div class="col text-right text-grey">{{ invoiceData.pco_real_name }}</div>
          </div>
          <div class="row q-pa-sm" v-if="parseInt(invoiceData.pco_donate_type) == 1">
            <div class="col">捐赠金额</div>
            <div class="col text-right text-red">
              {{ $q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol }}<span class="text-h6">{{ invoiceData.pco_donate_price }}</span>
            </div>
          </div>
          <div class="row q-pa-sm" v-if="parseInt(invoiceData.pco_donate_type) == 2">
            捐赠内容
          </div>
          <div class="row q-pa-sm text-red" v-if="parseInt(invoiceData.pco_donate_type) == 2">{{ invoiceData.pco_donate_detail }}</div>
          <div class="row q-pa-sm">
            备注
          </div>
          <div class="row q-pa-sm text-grey">{{ invoiceData.pco_remark ? invoiceData.pco_remark : '无备注' }}</div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ViewDetails',
  data () {
    return {
      pagination: {
        rowsPerPage: 0
      },
      dialogWidth: '1000px',
      couponsListData: [],
      viewDetails: false,
      invoiceData: {
      }

    }
  },
  components: {},
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },

  computed: {},
  methods: {
    getViewData (val) {
      this.viewDetails = true
      if (val > 0) {
        const obj = {
          id: val
        }
        this.$store
          .dispatch('csjz/getInvoiceView', obj)
          .then((res) => {
            if (res.code == 200) {
              this.invoiceData = res.data ? res.data : []
            }
          })
          .catch((error) => {})
      }
    },

    hideNowPage () {
      this.couponsListData = []
      this.viewDetails = false
    }
  }
}
</script>
