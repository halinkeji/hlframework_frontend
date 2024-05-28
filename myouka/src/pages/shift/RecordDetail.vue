<template>
  <q-dialog v-model="detailDialogStauts" maximized persistent>
    <q-card class="fit">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-md q-pb-md">
          <div class="text-subtitle1">交接班详情</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup  />
        </div>
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs row">
          <div class="col-auto q-px-sm">
            <q-input outlined dense label="交班时间" v-model="psr_get_time" readonly>

            </q-input>
          </div>
          <div class="col-auto q-px-sm">
            <q-input outlined dense label="接班时间" v-model="psr_out_time" readonly>

            </q-input>
          </div>
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <div class="row fit q-col-gutter-sm">
              <div class="col-12" v-if="consumeData && consumeData.title">
                <q-table
                  bordered
                  :title="consumeData.title"
                  :data="consumeData.dataList"
                  :columns="consumeData.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>

              <div class="col-6" v-if="kzlsIncomeData && kzlsIncomeData.title">
                <q-table
                  bordered
                  :title="kzlsIncomeData.title"
                  :data="kzlsIncomeData.dataList"
                  :columns="kzlsIncomeData.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
              <div class="col-6" v-if="kzlsExpendData && kzlsExpendData.title">
                <q-table
                  bordered
                  :title="kzlsExpendData.title"
                  :data="kzlsExpendData.dataList"
                  :columns="kzlsExpendData.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
              <div class="col-6" v-if="discountData && discountData.title">
                <q-table
                  bordered
                  :title="discountData.title"
                  :data="discountData.dataList"
                  :columns="discountData.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
              <div class="col-6" v-if="balanceAndIntegral && balanceAndIntegral.title">
                <q-table
                  bordered
                  :title="balanceAndIntegral.title"
                  :data="balanceAndIntegral.dataList"
                  :columns="balanceAndIntegral.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
              <div class="col-12" v-if="staffData && staffData.title">
                <q-table
                  bordered
                  :title="staffData.title"
                  :data="staffData.dataList"
                  :columns="staffData.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
              <div class="col-12" v-if="onOilStock && onOilStock.title">
                <q-table
                  bordered
                  :title="onOilStock.title"
                  :data="onOilStock.dataList"
                  :columns="onOilStock.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
              <div class="col-12" v-if="oilErpInvoice && oilErpInvoice.title">
                <q-table
                  bordered
                  :title="oilErpInvoice.title"
                  :data="oilErpInvoice.dataList"
                  :columns="oilErpInvoice.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>

              <div class="col-12" v-if="allTotalData && allTotalData.title">
                <q-table
                  bordered
                  :data="allTotalData.dataList"
                  :columns="allTotalData.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
              <div class="col-12" v-if="otherData && otherData.title">
                <q-table
                  bordered
                  :data="otherData.dataList"
                  :columns="otherData.tabelColumns"
                  row-key="name"
                  no-data-label="空"
                  flat
                  title-class="text-subtitle2 text-weight-bold"
                  hide-bottom
                  separator="cell"
                  :pagination="{
                    rowsPerPage: 0,
                  }"
                />
              </div>
            </div>
          </q-scroll-area>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'shiftReport',
  components: {},
  data () {
    return {
      detailDialogStauts: false,
      psr_get_time: '',
      psr_out_time: '',
      consumeData: {},
      balanceAndIntegral: {},
      onOilStock: {},
      oilErpInvoice: {},
      discountData: {},
      staffData: {},
      allTotalData: {},
      kzlsIncomeData: {},
      kzlsExpendData: {},
      otherData: {}
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (recordId) {
      this.detailDialogStauts = true

      if (recordId > 0) {
        this.recordId = recordId
        this.getSummaryList()
      }
    },
    getSummaryList () {
      this.$store
        .dispatch('shift/getItem', {
          shiftId: this.recordId
        })
        .then((res) => {
          if (res.code == 200) {
            this.psr_get_time = res.data ? this.$q_date.formatDate(res.data.psr_get_time * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
            this.psr_out_time = res.data ? this.$q_date.formatDate(res.data.psr_get_time * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
            this.consumeData = res.data ? res.data.psr_consume_count : {}
            this.discountData = res.data ? res.data.psr_discount_count : {}
            this.balanceAndIntegral = res.data ? res.data.psr_wealth_count : {}
            this.staffData = res.data ? res.data.psr_reward_count : {}
            this.kzlsIncomeData = res.data ? res.data.psr_other_income_count : {}
            this.kzlsExpendData = res.data ? res.data.psr_other_expend_count : {}
            this.onOilStock = res.data ? res.data.psr_oil_local_count : {}
            this.oilErpInvoice = res.data ? res.data.psr_oil_debt_count : {}

            this.allTotalData = res.data ? res.data.psr_total_count : {}

            this.otherData = res.data ? res.data.psr_total_settle_count : {}
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>
