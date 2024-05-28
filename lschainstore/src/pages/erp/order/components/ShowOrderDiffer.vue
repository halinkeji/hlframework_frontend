<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs ">
        <div class="row">
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input dense disable v-model="invoiceData.ced_order_number" label="差异单据号" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="invoiceData.order.ceo_order_number" label="补货单据号" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="invoiceData.orderGoods.cep_contract_number" label="订货单据号" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input
              disable
              dense
              v-model="invoiceData.order.ceo_total_replenishment_quantity - invoiceData.orderGoods.cep_total_purchase_num"
              label="差异数"
            />
          </div>

          <q-btn
              color="primary"
              class=" q-ma-sm "
              unelevated
              @click="exportCsv"
              label="导出Csv文件"
              :disable="differData.length == 0"
            />
        </div>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="differData"
          :rowDragManaged="true"
          :gridOptions="gridOptions"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :context="context"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        >
        </ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pa-md q-pb-xl">
        <q-form ref="erpInRef">
          <div class="row q-gutter-sm q-mt-xs q-pb-lg">
            <!-- <div class="col-auto">
              账单小计:<span class="text-primary  text-h6"> {{ invoiceData.cep_total_purchase_amount }}</span>
            </div>
            <div class="col-auto">
              总数量:<span class="text-primary text-h6">{{ invoiceData.cep_total_purchase_num }}</span>
            </div> -->
            <q-space />
            <div class="col-auto">
              <q-btn
                color="grey"
                class="q-px-xl"
                unelevated
                :to="{
                  name: 'erpOrder',
                  params: {
                    tab: '1',
                  },
                }"
                label="返回"
              />
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'showOrderDiffer',
  components: {},
  data () {
    return {
      gridOptions: {},
      chooseInvoiceVisible: false,
      context: null,
      searchValue: '',
      components: {},
      supplierData: [],
      differData: [],
      columnDefs: [
        {
          headerName: '条码',
          field: 'edd_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '商品名称',
          field: 'edd_archives_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '规格 ',
          field: 'edd_spe_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货数量',
          field: 'edd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货单价',
          field: 'edd_price',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '补货金额',
          field: 'edd_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '订货数量',
          field: 'edd_shipments_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '订货金额',
          field: 'edd_shipments_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '差异数量',
          field: 'edd_defect_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '差异金额',
          field: 'edd_defect_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '备注',
          field: 'edd_note',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('right')
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      showGoodsList: false,
      localeText: this.$ag_grid_localeText,
      orderId: '',
      orderGoodsId: '',
      invoiceData: {}
    }
  },

  computed: {},
  created () {
    this.context = this
    if (this.$route.query.order) {
      this.orderId = this.$route.query.order
      this.getItem()
    }
    if (this.$route.query.orderGoodsId) {
      this.orderGoodsId = this.$route.query.orderGoodsId
      this.getItem()
    }
  },
  mounted () {},
  methods: {
    getItem () {
      const obj = {
        order: this.orderId,
        orderGoods: this.orderGoodsId
      }
      this.$store
        .dispatch('erpOrderGoods/getDiffer', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceData = res.data ? res.data : {}
            this.differData = res.data.detail ? res.data.detail : []
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
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-差异单记录'
      })
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
