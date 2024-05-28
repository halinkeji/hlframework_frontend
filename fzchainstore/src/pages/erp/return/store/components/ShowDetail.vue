<template>
  <q-dialog v-model="isSidebarActiveLocal" persistent>
    <q-card
      class="q-pa-sm fit"
      :style="{
        width: this.$q.screen.width * 0.9 + 'px',
        'min-width': this.$q.screen.width * 0.9 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row justify-center">
            <h6 class="no-margin">退货单据明细</h6>
            <q-space />
            <q-btn unelevated flat round dense icon="close" v-close-popup />
          </div>
          <div class="row">
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input dense disable v-model="invoiceData.cep_contract_number" label="退货单据号" />
            </div>
            <div class="col-12 col-md-1 q-pa-xs">
              <q-input disable dense v-model="invoiceData.cep_depot_name" label="退货仓库" />
            </div>
            <!-- <div class="col-12 col-md-1 q-pa-xs">
              <q-input disable dense v-model="invoiceData.cep_supplier_name" label="供应商" />
            </div> -->
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input disable dense v-model="invoiceData.cep_total_purchase_amount" label="退货实付款" />
            </div>
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input disable dense v-model="invoiceData.cep_total_purchase_num" label="退货总数量" />
            </div>
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input disable dense v-model="invoiceData.cep_note" label="退货备注" />
            </div>
          </div>
        </div>
        <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="goodsInData"
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
              <div class="col-auto">
                账单小计:<span class="text-primary  text-h6"> {{ invoiceData.cep_total_purchase_amount }}</span>
              </div>
              <div class="col-auto">
                总数量:<span class="text-primary text-h6">{{ invoiceData.cep_total_purchase_num }}</span>
              </div>
              <q-space />
            </div>
          </q-form>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ShowDetail',
  components: {},
  data () {
    return {
      isSidebarActiveLocal: true,
      gridOptions: {},
      chooseInvoiceVisible: false,
      erpInFormData: {},
      context: null,
      searchValue: '',
      components: {},
      supplierData: [],
      goodsInData: [],
      columnDefs: [
        {
          headerName: '条码',
          field: 'esr_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '商品名称',
          field: 'esr_archives_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '货号',
          field: 'esr_article_code',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'esr_color_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'esr_size_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货数量',
          field: 'esr_return_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货单价',
          field: 'esr_price',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '折扣率',
          field: 'esr_discount_rate',
          filter: false,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折扣额',
          valueGetter: (p) => {
            return p.data.esr_archives_id > 0 ? (p.data.esr_fold_amount > 0 ? p.data.esr_fold_amount : 0) : ''
          },
          filter: false,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折后单价',
          field: 'esr_discount_after_amount',
          filter: false,
          valueGetter: (p) => {
            return p.data.esr_archives_id > 0 ? (p.data.esr_discount_after_amount > 0 ? p.data.esr_discount_after_amount : p.data.esr_price) : ''
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '退货金额',
          field: 'esr_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '备注',
          field: 'esr_note',
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
      inTotalAmount: 0,
      purchase_id: '',
      invoiceData: {}
    }
  },

  computed: {},
  created () {
    this.context = this
    // if (this.$route.query.id) {
    //   this.purchase_id = this.$route.query.id
    //   this.getItem()
    // }
  },
  mounted () {},
  methods: {
    getItem (val) {
      this.isSidebarActiveLocal = true
      const obj = {
        id: val
      }
      this.$store
        .dispatch('erpStoreReturn/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceData = res.data
            this.goodsInData = res.data.storeReturn.length > 0 ? res.data.storeReturn : []
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
