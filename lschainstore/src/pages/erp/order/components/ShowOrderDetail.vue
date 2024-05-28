<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs ">
        <div class="row">
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input dense disable v-model="invoiceData.cep_contract_number" label="订货单据号" />
          </div>

          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="invoiceData.cep_total_purchase_amount" label="订货实付款" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="invoiceData.cep_total_purchase_num" label="订货总数量" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="invoiceData.cep_note" label="订货备注" />
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
  name: 'ShowDetail',
  components: {},
  data () {
    return {
      gridOptions: {},
      chooseInvoiceVisible: false,
      erpInFormData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_shipments_quantity: 0,
        cep_total_purchase_amount: 0,
        cep_total_defect_quantity: 0,
        cep_supplier_id: '',
        cep_note: '',
        cep_pay_type: '',
        cep_supplier_name: '',
        cep_supplier_code: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_buyer_id: '',
        cep_buyer_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: 3
      },
      context: null,
      searchValue: '',
      components: {},
      supplierData: [],
      goodsInData: [],
      columnDefs: [
        {
          headerName: '条码',
          field: 'epd_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '商品名称',
          field: 'epd_archives_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.12) + 'px'
        },
        {
         headerName: '规格 ',
          field: 'epd_spe_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '订货数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '订货单价',
          field: 'epd_price',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '折扣率',
          field: 'epd_discount_rate',
          filter: false,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折扣额',
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_fold_amount > 0 ? p.data.epd_fold_amount : 0) : ''
          },
          filter: false,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '折后单价',
          field: 'epd_discount_after_amount',
          filter: false,
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_discount_after_amount > 0 ? p.data.epd_discount_after_amount : p.data.epd_price) : ''
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '订货金额',
          field: 'epd_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '备注',
          field: 'epd_note',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0
          },
          onCellValueChanged: this.changeNumber,
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
    if (this.$route.query.id) {
      this.purchase_id = this.$route.query.id
      this.getItem()
    }
  },
  mounted () {},
  methods: {
    getItem () {
      const obj = {
        id: this.purchase_id
      }
      this.$store
        .dispatch('erpOrderGoods/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceData = res.data
            this.goodsInData = res.data.orderin ? res.data.orderin : res.data.buffer
            // this.invoiceData = res.data.invoice ? res.data.invoice : {}
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
