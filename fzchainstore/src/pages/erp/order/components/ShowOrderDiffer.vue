<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row  q-gutter-xs ">
          <q-btn
            color="grey"
            unelevated
            :to="{
              name: 'erpOrder',
              params: {
                tab: '1',
              },
            }"
            label="返回"
          />

          <div class="col ">
            <q-input readonly borderless dense v-model="orderData.cep_contract_number" label="补货单据号" />
          </div>

          <div class="col ">
            <q-input readonly borderless dense v-model="orderData.cep_total_purchase_amount" label="补货单总金额" />
          </div>
          <div class="col ">
            <q-input readonly borderless dense v-model="orderData.cep_total_purchase_num" label="补货单总数量" />
          </div>

          <div class="col ">
            <q-input readonly borderless dense v-model="patchGoodsOrderData.cep_contract_number" label="订货单据号" />
          </div>

          <div class="col ">
            <q-input readonly borderless dense v-model="patchGoodsOrderData.cep_total_purchase_amount" label="订货单总金额" />
          </div>
          <div class="col ">
            <q-input readonly borderless dense v-model="patchGoodsOrderData.cep_total_purchase_num" label="订货单总数量" />
          </div>

          <div class="col ">
            <q-input readonly borderless dense v-model="patchGoodsOrderData.cep_total_purchase_amount" label="订货单总金额" />
          </div>
          <div class="col ">
            <q-input readonly borderless dense v-model="patchGoodsOrderData.cep_total_purchase_num" label="订货单总数量" />
          </div>

          <div class="col text-center">
             <q-item-section>
              <q-item-label  class="text-primary text-weight-bold text-subtitle2">
                {{ formatAmount(orderData.cep_total_purchase_amount - patchGoodsOrderData.cep_total_purchase_amount) }}
              </q-item-label>
              <q-item-label caption>
                差异金额
              </q-item-label>
             </q-item-section>
          </div>

          <div class="col text-center">
             <q-item-section>
              <q-item-label  class="text-primary text-weight-bold text-subtitle2">
                {{ formatAmount(orderData.cep_total_purchase_num - patchGoodsOrderData.cep_total_purchase_num) }}
              </q-item-label>
              <q-item-label caption>
                差异数量
              </q-item-label>
             </q-item-section>
          </div>

          <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="patchBufferData.length == 0" />
        </div>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2 q-pb-sm">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="patchBufferData"
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
      patchBufferData: [],
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
          headerName: '货号',
          field: 'epd_article_code',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'epd_color_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'epd_size_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货数量',
          field: 'epd_patch_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '补货单价',
          field: 'epd_patch_price',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '补货金额',
          field: 'epd_patch_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '订货数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '订货金额',
          field: 'epd_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '差异数量',
          field: 'epd_defect_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.epd_patch_quantity - p.data.epd_quantity)
          }
        },

        {
          headerName: '差异金额',
          field: 'epd_defect_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.epd_patch_cash_amount - p.data.epd_cash_amount)
          }
        },

        {
          headerName: '备注',
          field: 'epd_note',
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
      orderData: {},
      patchGoodsOrderData: {}
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
        id: this.orderId
        // orderGoods: this.orderGoodsId
      }
      this.$store
        .dispatch('erpOrderGoods/getDiffer', obj)
        .then((res) => {
          if (res.code == 200) {
            this.orderData = res.data.orderGoodsData && res.data.orderGoodsData.id ? res.data.orderGoodsData : {}
            this.patchBufferData = res.data.patchBufferData && res.data.patchBufferData.length > 0 ? res.data.patchBufferData : []
            this.patchGoodsOrderData = res.data.patchGoodsOrderData && res.data.patchGoodsOrderData.id ? res.data.patchGoodsOrderData : {}
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
